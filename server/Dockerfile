# ------------------------------
# Base Python image
# ------------------------------
FROM python:3.11-slim

# ------------------------------
# Install system dependencies for Chrome & Node
# ------------------------------
RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    curl \
    gnupg \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    git \
    build-essential \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# ------------------------------
# Install Google Chrome
# ------------------------------
RUN wget -q -O google-chrome.deb https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
    && apt install -y ./google-chrome.deb \
    && rm google-chrome.deb

# Set Chrome binary path
ENV CHROME_BIN=/usr/bin/google-chrome
ENV PATH=$CHROME_BIN:$PATH

# ------------------------------
# Install Node.js for building React frontend
# ------------------------------
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@latest

# ------------------------------
# Setup app working directory
# ------------------------------
WORKDIR /app

# Copy Python requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# ------------------------------
# Copy backend & frontend code
# ------------------------------
COPY . .

# ------------------------------
# Build React frontend
# ------------------------------
WORKDIR /app/client
RUN npm install
RUN npm run build

# ------------------------------
# Serve React build via Flask
# ------------------------------
WORKDIR /app

# Expose Flask port
EXPOSE 5000

# ------------------------------
# Production server
# ------------------------------
CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app", "--workers=1", "--threads=4"]
