def fileVersion= ""
def fileVersionNum = ""
def VersionTag= ""
def buildDate = new Date().format("MMMM d yyyy HH:mm")

pipeline {
	agent any
	stages {
		stage('Clean Workspace'){
			steps{
				dir('Archive') {
    			deleteDir()
				}
				sh 'mkdir Archive'
    	}
    }
    stage('Setup File Version'){
	  	steps{
	  		script {
	  			fileVersion = "${params.Version}" + "." + "${env.BUILD_NUMBER}"
	  			echo "fileVersion: " + "${fileVersion}"
    			fileVersionNum = "${params.Version}".replace('.',',') + "," + "${env.BUILD_NUMBER}"		
    			echo "fileVersionNum: " + "${fileVersionNum}"
    			VersionTag = "v" + "${fileVersion}"
    			echo "VersionTag: " + "${VersionTag}"
    		}
    	}
    }
    stage('Checkout') {
	    steps{
	    	script {
                if (params.Version == '') { 
                    currentBuild.result = 'ABORTED'
                    error('Version not set')
                }
        }
				checkout([  
				            $class: 'GitSCM', 
				            branches: [[name: 'gm-branch']], 
				            doGenerateSubmoduleConfigurations: false, 
				            submoduleCfg: [], 
				            userRemoteConfigs: [[credentialsId: 'buildmaster', url: 'git@cvgapgithub01.td.afg:risksolutions/rsps']]
				        ])
			}
		}
		stage("Builds"){
			steps{
	      parallel ( 
	      /* "initial setup1": {
		      		sh 'export NVM_DIR="$HOME/.nvm"'
		      }, 
		      "initial setup2": {
		      		sh '[ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh"'
		      }, 
		      "initial setup3": {
		      		sh '[ -s "$NVM_DIR/bash_completion" ] && \\. "$NVM_DIR/bash_completion"'
		      }, 
		      "initial setup4": {		
		      		sh 'nvm use v14.18.1'
		      }, */
		       "initial setup1": {
				      sh 'pwd'
		      }, 
		      "initial setup3": {
		      		sh 'chmod +x ./build.sh'
		      }, 
		       "initial setup3": {
		      		sh './build.sh'
		      }, 
		      "Build npm Install": {
		      		sh 'npm install'
		      },
		      "Build rsps": {
		      		sh 'npm run build:server'
		      }
				)
    	} 
		}
	}
}
