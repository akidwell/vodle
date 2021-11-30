def fileVersion= ""
def fileVersionNum = ""
def VersionTag= ""
def buildDate = new Date().format("MMMM d yyyy HH:mm")

pipeline {
	agent any
	stages {
		stage('Clean Workspace'){
			steps{
				cleanWs()
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
					branches: [[name: 'master']], 
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
		stage('Deploy to DEV') {	
			steps{
				script {
					sh """
					mkdir ${WORKSPACE}/datmp
					mv ${WORKSPACE}/*.zip ${WORKSPACE}/datmp/
					"""
				    withCredentials([string(credentialsId: "JENKINSSDATOKEN", variable: "JENKINSTOKEN")]) {      	
					sh """
          DACREATEOUTPUT=`${SDACMD} createVersion -component 59803989-b407-49e1-8d9e-b718f4d2d947 -status imported -name TFSBLDS:rsps_${fileVersion}`
          set |grep DACREATEOUT
					"""
					sh """
          DAADDOUTPUT=`${SDACMD} addVersionFiles -component 59803989-b407-49e1-8d9e-b718f4d2d947 -version TFSBLDS:rsps_${fileVersion} -base ${WORKSPACE}/datmp/`
          set |grep DAADDOUT
					"""
				    }						
				}
				wrap([$class: 'BuildUser']) {
				build (job: 'TFS_to_SDA', 
					parameters: [
						string(name: 'SDAAPPLICATION', value: "f8ae9b8a-bb31-41f1-ba52-4f3e62f1add1"),
						string(name: 'SDACOMPONENT', value: "59803989-b407-49e1-8d9e-b718f4d2d947"),
						string(name: 'SDAENV', value: "079dfff5-a084-4eb8-a0e0-848cf586593e"),
						string(name: 'SDAPROCESS', value: "10f049ac-a05e-42b9-bd45-81f745cbab7e"),
            string(name: 'PROJECTNAME', value: "RSPS_UI"),
						string(name: 'DMPRODUCT', value: "TFSBLDS"),
						string(name: 'BUILDNAME', value: "rsps_${fileVersion}"),
						string(name: 'TFSUSER', value: "$BUILD_USER"),
						string(name: 'SKIPIMPORT', value: "false"),
						string(name: 'DEPLOYME', value: "true")
					],
					wait: true
				)
				}
			}
		}    
	}
}
