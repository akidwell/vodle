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
				bat("mkdir Archive")
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
				            branches: [[name: 'master']], 
				            doGenerateSubmoduleConfigurations: false, 
				            submoduleCfg: [], 
				            userRemoteConfigs: [[credentialsId: 'buildmaster', url: 'git@cvgapgithub01.td.afg:risksolutions/rsps']]
				        ])
			}
		}
		stage("Builds"){
			steps{
	      parallel ( 
		      "Build npm Install": {
		      		bat("npm install")
		      },
		      "Build rsps": {
		      		bat("npm run build:server")
		      }
				)
    	} 
		}
	}
}
