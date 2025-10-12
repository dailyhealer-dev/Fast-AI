# 1️⃣ Base Python image
FROM python:3.13.7-bookworm

# 2️⃣ Prevent Python from writing .pyc files and enable unbuffered output
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 3️⃣ Set working directory
WORKDIR /app

# 4️⃣ Install OS dependencies (curl, etc.)
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# 5️⃣ Copy uv binaries from GitHub Container Registry
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# 6️⃣ Copy only requirements first to leverage Docker cache
COPY src/requirements.txt .

# 7️⃣ Install Python dependencies
# Use --no-cache-dir to save space, --upgrade to avoid old versions
RUN uv pip install --system --no-cache-dir -r requirements.txt

# 8️⃣ Copy the rest of the project
COPY src/ .

# 9️⃣ Expose ports
EXPOSE 8000 8080

# 🔟 Default entrypoint
CMD ["./entrypoint.sh"]
