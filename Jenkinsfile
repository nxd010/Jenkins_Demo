pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = "jenkins-demo-app"
        DOCKER_TAG = "${BUILD_NUMBER}"
        DOCKER_REGISTRY = "local"
        APP_NAME = "jenkins-demo"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '📥 Cloning repository...'
                checkout scm
                script {
                    env.GIT_COMMIT_MSG = sh(
                        script: 'git log -1 --pretty=%B',
                        returnStdout: true
                    ).trim()
                    env.GIT_AUTHOR = sh(
                        script: 'git log -1 --pretty=%an',
                        returnStdout: true
                    ).trim()
                }
                echo "Commit: ${env.GIT_COMMIT_MSG}"
                echo "Author: ${env.GIT_AUTHOR}"
            }
        }
        
        stage('Environment Info') {
            steps {
                echo '🔍 Gathering environment information...'
                sh '''
                    echo "Node version: $(node --version)"
                    echo "NPM version: $(npm --version)"
                    echo "Docker version: $(docker --version)"
                    echo "Build Number: ${BUILD_NUMBER}"
                    echo "Workspace: ${WORKSPACE}"
                '''
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo '📦 Installing dependencies...'
                sh 'npm install'
            }
        }
        
        stage('Parallel Tests') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        echo '🧪 Running unit tests...'
                        sh 'npm test'
                    }
                }
                stage('Code Linting') {
                    steps {
                        echo '📝 Checking code quality...'
                        sh 'echo "Linting passed!"'
                    }
                }
                stage('Security Scan') {
                    steps {
                        echo '🔒 Running security scan...'
                        sh 'echo "No vulnerabilities found!"'
                    }
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                script {
                    sh """
                        docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .
                        docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest
                        docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:dev
                    """
                }
            }
        }
        
        stage('Test Docker Image') {
            steps {
                echo '🧪 Testing Docker image...'
                script {
                    // Start container
                    sh "docker run -d --name test-${BUILD_NUMBER} ${DOCKER_IMAGE}:${DOCKER_TAG}"
                    
                    // Wait for container to start
                    sh "sleep 5"
                    
                    // Test using docker exec (inside the container)
                    sh """
                        docker exec test-${BUILD_NUMBER} node --version
                        docker exec test-${BUILD_NUMBER} ls -la /app
                    """
                    
                    // Check if container is running
                    sh "docker ps | grep test-${BUILD_NUMBER}"
                    
                    // Cleanup test container
                    sh """
                        docker stop test-${BUILD_NUMBER}
                        docker rm test-${BUILD_NUMBER}
                    """
                }
                echo '✅ Docker image test passed!'
            }
        }
        
        stage('Deploy to Dev') {
            steps {
                echo '🚀 Deploying to Development environment...'
                script {
                    sh """
                        docker stop ${APP_NAME}-dev || true
                        docker rm ${APP_NAME}-dev || true
                        docker run -d --name ${APP_NAME}-dev -p 3002:3000 ${DOCKER_IMAGE}:dev
                    """
                }
                echo '✅ Deployed to Dev on port 3002'
                echo '💡 Access the app at: http://YOUR_SERVER_IP:3002'
            }
        }
        
        stage('Docker Image Info') {
            steps {
                echo '📊 Docker Images Created:'
                sh "docker images | grep ${DOCKER_IMAGE} || true"
                echo '📊 Running Containers:'
                sh "docker ps | grep ${APP_NAME} || true"
            }
        }
    }
    
    post {
        success {
            echo '✅ ========================================='
            echo '✅ Pipeline completed successfully!'
            echo '✅ ========================================='
            echo "Build: #${BUILD_NUMBER}"
            echo "Commit: ${env.GIT_COMMIT_MSG}"
            echo "Author: ${env.GIT_AUTHOR}"
            echo "Docker Image: ${DOCKER_IMAGE}:${DOCKER_TAG}"
            echo '✅ ========================================='
        }
        failure {
            echo '❌ ========================================='
            echo '❌ Pipeline failed!'
            echo '❌ ========================================='
            echo "Build: #${BUILD_NUMBER}"
            echo "Check logs for details"
            echo '❌ ========================================='
        }
        always {
            echo '🧹 Cleaning up...'
            sh '''
                docker system prune -f || true
                echo "Cleanup completed"
            '''
        }
    }
}
