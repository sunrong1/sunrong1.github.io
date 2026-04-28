---
date: 2026-04-20
tags:
  - Qwen
  - Embedding
  - llama.cpp
  - 向量数据库
  - RAG
  - 模型部署
author: Mr.Sun
---

# Qwen3-Embedding-4B 部署实战：从选型到生产环境

> 4 月 20 日完成 Qwen3-Embedding-4B 和 Qwen 3.6-35B 的生产环境部署，本文详细记录选型思路、部署流程、踩坑经验，以及实际验证代码。

<!-- more -->

## 一、为什么要部署 Embedding 模型？

Embedding 模型是 RAG（检索增强生成）的核心组件，负责将文本转换为向量表示。

**应用场景：**
- 语义搜索：输入一段文字，找到语义相似的内容
- 知识库检索：从大量文档中召回相关内容
- 文本分类：利用 embedding 向量进行分类
- 相似度匹配：找相似文档、相似问答

**为什么选择 Qwen3-Embedding-4B：**
- 4B 参数规模，中等配置即可运行
- 支持 Matryoshka Representation Learning (MRL)
- 可变维度 embedding，灵活适配不同场景
- 国产模型，社区活跃

---

## 二、模型选择对比

### 2.1 部署方案对比

| 方案 | 优点 | 缺点 | 推荐场景 |
|------|------|------|----------|
| **llama.cpp + GGUF** | 对老旧硬件友好，社区资源丰富 | 需要手动转换格式 | ✅ 生产首选 |
| **vLLM** | 高吞吐，推理速度快 | 配置复杂，embedding 模式需要特殊参数 | 实验/高配显卡 |

### 2.2 量化版本对比

| 版本 | 精度 | 稳定性 | 适用场景 |
|------|------|--------|----------|
| **FP16** | 更高 | ✅ **更稳定** | 生产环境 |
| Q8 | 量化 | 偶尔抖动 | 测试/实验 |

**结论：** 生产环境使用 FP16 版本，虽然显存占用更高，但稳定性更好。

---

## 三、部署流程

### 3.1 环境准备

**硬件要求：**
- 显卡：V100 32GB × 1（或同等配置）
- 系统：Ubuntu 20.04+
- CUDA：11.0+

**软件依赖：**
```bash
# 编译 llama.cpp
git clone https://github.com/ggerganov/llama.cpp.git
cd llama.cpp
mkdir build && cd build
cmake ..
make -j$(nproc)
```

### 3.2 模型下载与转换

**下载原始模型（从 HuggingFace）：**
```bash
# 使用 huggingface-cli 或 git clone
git lfs install
git clone https://huggingface.co/Qwen/Qwen3-Embedding-4B
```

**转换为 GGUF 格式：**
```bash
# 使用 llama.cpp 提供的转换脚本
python3 convert-hf-to-gguf.py /path/to/Qwen3-Embedding-4B \
    --outfile /data/models/Qwen3-Embedding-4B.gguf
```

### 3.3 最终部署命令

```bash
CUDA_VISIBLE_DEVICES=3 nohup ./build/bin/llama-server \
 -m /data/models/Qwen3-Embedding-4B.gguf \
 --host 0.0.0.0 \
 --port 8000 \
 -ngl 99 \
 --pooling cls \
 --embedding \
 --cont-batching \
 --batch-size 256 \
 --ubatch-size 128 \
 --flash-attn auto \
 --threads 16 \
 --threads-batch 8 \
 --mlock \
 --no-mmap \
 --log-format json \
 -c 2048 \
 --parallel 4 \
 > /var/log/llama-server.log 2>&1 &
```

---

## 四、命令参数详解

| 参数 | 说明 | 推荐值 |
|------|------|--------|
| `-m` | 模型文件路径 | /data/models/Qwen3-Embedding-4B.gguf |
| `--host` | 监听地址 | 0.0.0.0 |
| `--port` | 监听端口 | 8000 |
| `-ngl 99` | GPU 加载层数 | 99 表示全部加载到 GPU |
| `--pooling cls` | 池化方式 | CLS pooling |
| `--embedding` | **启用 embedding 模式** | 必须添加 |
| `--cont-batching` | 启用连续批处理 | 提升吞吐 |
| `--batch-size` | 批处理大小 | 256 |
| `--ubatch-size` | micro batch 大小 | 128 |
| `--flash-attn auto` | Flash Attention | auto 自动检测 |
| `--threads 16` | CPU 线程数 | 16 |
| `--threads-batch 8` | batch 模式线程数 | 8 |
| `-c 2048` | 上下文长度 | 2048 |
| `--parallel 4` | 并行请求数 | 4 |
| `--mlock` | 锁定内存 | 防止换出 |
| `--no-mmap` | 不使用内存映射 | 配合 mlock 使用 |

---

## 五、踩坑记录

### 5.1 vLLM 部署问题

**问题 1：缺少 embedding-mode 参数**
```bash
# 错误写法
llama-server -m model.gguf --port 8000

# 正确写法（vllm）
--embedding-mode  # vLLM 需要明确指定
```

**问题 2：模型名称不匹配**
```
--served-model-name 需要与实际模型名称一致
```

**问题 3：vLLM 0.16 + V100 默认禁用 MRL**
```
即使模型支持 Matryoshka，vLLM 也可能默认不启用
```

### 5.2 llama.cpp 方案优势

- ✅ 对老旧硬件（V100）兼容性更好
- ✅ 社区有现成的 GGUF 文件
- ✅ `--embedding` 参数简单直接
- ✅ MRL 支持只需请求中不加 dimensions

---

## 六、验证方式

### 6.1 curl 快速验证

```bash
curl http://localhost:8000/embedding \
  -H "Content-Type: application/json" \
  -d '{"content": "今天天气真好"}'
```

### 6.2 Python 集成代码

```python
from agentscope.store import (
    OpenAITextEmbedding,
    VectorStoreConfig,
)

# 1. 配置 Embedding 模型
embedding_model = OpenAITextEmbedding(
    api_key="EMPTY",
    base_url="http://localhost:8000/v1",
    model_name="Qwen3-Embedding-4B",
)

# 2. 配置向量数据库（使用 Qdrant）
vector_store_config = VectorStoreConfig(
    provider="qdrant",
    config={
        "on_disk": True,
        "path": "../memory/qdrant_data",
        "embedding_model_dims": 2560,  # Qwen3-Embedding-4B 原生维度
    },
)

# 3. 验证服务
response = embedding_model TextEmbedding.create("你好世界")
print(f"Embedding 向量维度: {len(response)}")
```

---

## 七、Qwen 3.6-35B 部署命令参考

作为对比，这里提供 Qwen 3.6-35B 的部署命令：

```bash
./build/bin/llama-server \
 --model /data/models/qwen3.6-q8/Qwen3.6-35B-A3B-UD-Q8_K_XL.gguf \
 --host 100.102.240.49 \
 --port 8001 \
 --ctx-size 524288 \
 --parallel 4 \
 --n-gpu-layers 99 \
 --tensor-split 1,1,1,1 \
 --cache-type-k q8_0 \
 --cache-type-v q8_0 \
 --batch-size 2048 \
 --ubatch-size 512 \
 --threads 32 \
 --defrag-threshold 0.1 \
 --jinja \
 --temp 0.7 \
 --top-p 0.95 \
 --alias Qwen3.6-35B-q8
```

**关键差异：**
- 3.6-35B 需要 3 张 V100（tensor-split 1,1,1,1）
- Embedding 模型只需 1 张 V100
- Embedding 模型端口 8000，3.6-35B 端口 8001

---

## 八、硬件配置总结

| 模型 | 显卡 | 显存 | 端口 |
|------|------|------|------|
| Qwen 3.6-35B | 3 × V100 32GB | 96GB | 8001 |
| Qwen3-Embedding-4B | 1 × V100 32GB | 32GB | 8000 |

---

## 九、总结

### 9.1 部署建议

1. **生产环境**：使用 llama.cpp + FP16 版本
2. **Embedding**：使用 llama.cpp + GGUF，显存要求更低
3. **量化版本**：Q8 适合测试，生产用 FP16 更稳定

### 9.2 关键参数

- `--embedding`：llama.cpp 部署 embedding 模型的必须参数
- `-ngl 99`：全部层加载到 GPU
- `--pooling cls`：CLS 池化方式
- `embedding_model_dims: 2560`：Qwen3-Embedding-4B 原生维度

### 9.3 下一步

基础设施完善后，可以进行：
- RAG 应用开发
- 知识库构建
- 向量语义搜索
- 本地 AI Agent 开发

---

## 参考资料

- [llama.cpp GitHub](https://github.com/ggerganov/llama.cpp)
- [Qwen3-Embedding-4B HuggingFace](https://huggingface.co/Qwen/Qwen3-Embedding-4B)
- [Matryoshka Representation Learning](https://arxiv.org/abs/2205.13147)

---

_保持学习，持续进步。_

---

如果你也在学习 AI Agent，欢迎交流讨论，我的 blog：https://sunrong.site
