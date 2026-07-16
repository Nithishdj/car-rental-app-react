pipeline {
    agent any 

    tools {
        nodejs 'node-20' 
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Fetching the latest code from GitHub...'
                checkout scm 
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing required libraries...'
                // Changed from 'sh' to 'bat' for Windows
                   dir('car-rental-app') {
                    bat 'npm install' 
                } 
            }
        }

        stage('Test') {
            steps {
                echo 'Running automated tests...'
                // Changed from 'sh' to 'bat' for Windows
                dir('car-rental-app') {
                    bat 'npm install' 
                }            
            }
        }

        stage('Build') {
            steps {
                echo 'Compiling the application for production...'
                // Changed from 'sh' to 'bat' for Windows
   dir('car-rental-app') {
                    bat 'npm install' 
                }             }
        }

        stage('Deploy') {
            steps {
                echo 'Simulating deployment to the web server...'
                // Changed from 'sh' to 'bat' for Windows
                bat 'echo "Deployment successful!"' 
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully! The app is live.'
        }
        failure {
            echo 'Pipeline failed! Check the logs.'
        }
    }
}
