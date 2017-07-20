pipeline {
    agent any

    stages {
        stage('Docker Login') {
            steps {
                sh 'bash -c "eval $(aws ecr get-login --region eu-west-1)"'
            }
        }
        stage('Release') {
            steps {
                sh 'bash -c "make docker_release"'
            }
        }
        stage('Tag') {
            steps {
                sh 'bash -l -c "make tag"'
            }
        }
        stage('Notify') {
            steps {
                sh 'bash -l -c "make docker_notify"'
            }
        }
    }

    post {
        always {
            deleteDir() /* clean up our workspace */
        }
        success {
            notifyBuild('SUCCESSFUL')
        }
        unstable {
            notifyBuild('UNSTABLE')
        }
        failure {
            notifyBuild('FAILURE')
        }
    }
}

def notifyBuild(String buildStatus = 'STARTED') {
  // build status of null means successful
  buildStatus =  buildStatus ?: 'SUCCESSFUL'

  // Default values
  def colorName = 'RED'
  def colorCode = '#FF0000'
  def subject = "${buildStatus}: Job '${env.JOB_NAME}'"
  def summary = "${subject} (${env.BUILD_URL})"

  // Override default values based on build status
  if (buildStatus == 'STARTED') {
    color = 'YELLOW'
    colorCode = '#FFFF00'
  } else if (buildStatus == 'SUCCESSFUL') {
    color = 'GREEN'
    colorCode = '#00FF00'
  } else if (buildStatus == 'UNSTABLE') {
    color = 'ORANGE'
    colorCode = '#FF8800'
  } else {
    color = 'RED'
    colorCode = '#FF0000'
  }

  // Send notifications
  slackSend (color: colorCode, message: summary)
}
