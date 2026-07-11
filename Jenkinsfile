pipeline {
    agent any

    environment {
        NODE_ENV = 'test'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Verify and Test') {
            parallel {
                stage('Static Analysis') {
                    steps {
                        sh 'npm run lint'
                    }
                }
                stage('Unit Tests') {
                    steps {
                        sh 'npm run test'
                    }
                }
            }
        }

        stage('Publish Artifacts') {
            steps {
                archiveArtifacts artifacts: 'dist/*.js', followSymlinks: false
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
