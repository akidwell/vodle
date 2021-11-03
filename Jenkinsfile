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
					userRemoteConfigs: [[url: 'git@cvgapgithub01.td.afg:risksolutions/rsps']]
				])
			}
		}
		stage('Config') {
			steps{
				script {
					def jsonfile = readJSON file: './src/assets/config/config.dev.json'
					jsonfile['buildVersion'] = "${fileVersion}".toString()
					writeJSON file: './src/assets/config/config.json', json: jsonfile
				}
			}
		}
		stage("Builds"){
			steps{
				sh 'chmod +x ./build.sh'
				sh './build.sh'
			} 
		}
		stage('Zip') {	
			steps{
				zip zipFile: "rsps_${fileVersion}.zip", archive: false, dir: "dist/rsps"
			}
		}
		stage('Archive') {	
			steps{
				archiveArtifacts artifacts: "rsps_${fileVersion}.zip", fingerprint: true
			}
		}
	}
}
