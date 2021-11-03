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
	       "Update verson in config": {
		      	  jq ".buildVersion = ${fileVersion}" ./src/assets/config/config.dev.json|sponge ./src/assets/config/config.dev.json
		      },     
		      "Setup security on build file": {
		      		sh 'chmod +x ./build.sh'
		      }, 
		       "Run build script file": {
		      		sh './build.sh'
		      }
				)
    	} 
		}
		stage('Zip') {	
			steps{
				zip zipFile: "RSPS_${fileVersion}.zip", archive: false, dir: "dist/rsps"
			}
		}
		stage('Archive') {	
			steps{
				archiveArtifacts artifacts: "RSPS_${fileVersion}.zip", fingerprint: true
			}
		}
	}
}
