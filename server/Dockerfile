# Use Python 3.11 slim image
FROM python:3.11-slim

# Install dependencies for Chrome
RUN apt-get update && apt-get install -y \
    wget unzip gnupg curl xvfb \
    fonts-liberation libnss3 libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxi6 \
    libxtst6 libxrandr2 libasound2 libatk1.0-0 libcups2 libxss1 libgtk-3-0 \
    libglib2.0-0 libatk-bridge2.0-0 libpangocairo-1.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Install Chrome
RUN wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN apt-get install -y ./google-chrome-stable_current_amd64.deb || apt-get -f install -y
RUN rm google-chrome-stable_current_amd64.deb

# Set working directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY . .

# Expose Flask port
EXPOSE 5000

# Run Flask app with eventlet
CMD ["python", "app.py"]
