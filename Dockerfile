# Use Python 3.13.0 base image
FROM python:3.13.0

# Set the working directory inside the container
WORKDIR /app

# Copy the entire app folder and requirements.txt to the container
COPY ./app /app
COPY requirements.txt /app/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the default FastAPI port
EXPOSE 8000

# Run FastAPI with Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]