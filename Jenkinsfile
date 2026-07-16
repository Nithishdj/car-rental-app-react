pipeline {
    agent any 

    // We will use Node.js to build our web app
    tools {
        nodejs 'node-20' // Assumes you have NodeJS configured in Jenkins
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Fetching the latest code from GitHub...'
                checkout scm // This built-in command pulls your Git repository
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing required libraries...'
                // Standard command for React/Node full-stack apps
                sh 'npm install' 
            }
        }

        stage('Test') {
            steps {
                echo 'Running automated tests...'
                sh 'npm test' 
            }
        }

        stage('Build') {
            steps {
                echo 'Compiling the application for production...'
                sh 'npm run build' 
            }
        }

        stage('Deploy') {
            steps {
                echo 'Simulating deployment to the web server...'
                // In a real scenario, this pushes the 'build' folder to AWS/Azure/etc.
                sh 'echo "Deployment successful!"' 
            }
        }
    }
    
    // This runs after all stages finish, acting as a status report
    post {
        success {
            echo 'Pipeline completed successfully! The app is live.'
        }
        failure {
            echo 'Pipeline failed! Check the logs.'
        }
    }
}
