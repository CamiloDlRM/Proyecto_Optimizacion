FROM ubuntu:latest


RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    git \
    postgresql \
    postgresql-contrib \
    libpq-dev \
    gcc \
    python3-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*


WORKDIR /app


COPY requirements.txt .


RUN python3 -m venv venv
RUN ./venv/bin/pip install --upgrade pip
RUN ./venv/bin/pip install -r requirements.txt



CMD ["tail", "-f", "/dev/null"]