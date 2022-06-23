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
					 branches: [[name: "${params['Branch']}"]],
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
					writeJSON file: './src/assets/config/config.dev.json', json: jsonfile
					writeJSON file: './src/assets/config/config.json', json: jsonfile

					def jsonIntfile = readJSON file: './src/assets/config/config.int.json'
					jsonIntfile['buildVersion'] = "${fileVersion}".toString()
					writeJSON file: './src/assets/config/config.int.json', json: jsonIntfile

					def jsonUATfile = readJSON file: './src/assets/config/config.uat.json'
					jsonUATfile['buildVersion'] = "${fileVersion}".toString()
					writeJSON file: './src/assets/config/config.uat.json', json: jsonUATfile

					def jsonCertfile = readJSON file: './src/assets/config/config.cert.json'
					jsonCertfile['buildVersion'] = "${fileVersion}".toString()
					writeJSON file: './src/assets/config/config.cert.json', json: jsonCertfile

					def jsonProdfile = readJSON file: './src/assets/config/config.prod.json'
					jsonProdfile['buildVersion'] = "${fileVersion}".toString()
					writeJSON file: './src/assets/config/config.prod.json', json: jsonProdfile
				}
			}
		}
		stage("Build Dev"){
			when {
	      		expression { params.Environment == "DEV"}
	    	}
			steps{
				sh 'chmod +x ./build-dev.sh'
				sh './build-dev.sh'
			} 
		}
		stage("Build ngws.json"){
			steps{
				script {
					def jsonfile = readJSON file: './dist/rsps/ngsw.json'
					def devHash = jsonfile['/rsps/assets/config/config.dev.json'] 
					jsonfile['/rsps/assets/config/config.json'] = "${devHash}".toString()
					writeJSON file: './dist/rsps/ngsw.dev.json', json: jsonfile

					//def jsonfile = readJSON file: './dist/rsps/ngsw.json'
					def intHash = jsonfile['/rsps/assets/config/config.int.json'] 
					jsonfile['/rsps/assets/config/config.json'] = "${intHash}".toString()
					writeJSON file: './dist/rsps/ngsw.int.json', json: jsonfile

					//def jsonfile = readJSON file: './dist/rsps/ngsw.json'
					def uatHash = jsonfile['/rsps/assets/config/config.uat.json'] 
					jsonfile['/rsps/assets/config/config.json'] = "${uatHash}".toString()
					writeJSON file: './dist/rsps/ngsw.uat.json', json: jsonfile

					//def jsonfile = readJSON file: './dist/rsps/ngsw.json'
					def certHash = jsonfile['/rsps/assets/config/config.cert.json'] 
					jsonfile['/rsps/assets/config/config.json'] = "${certHash}".toString()
					writeJSON file: './dist/rsps/ngsw.cert.json', json: jsonfile

					//def jsonfile = readJSON file: './dist/rsps/ngsw.json'
					def prodHash = jsonfile['/rsps/assets/config/config.prod.json'] 
					jsonfile['/rsps/assets/config/config.json'] = "${prodHash}".toString()
					writeJSON file: './dist/rsps/ngsw.prod.json', json: jsonfile

					// def jsonIntfile = readJSON file: './src/assets/config/config.int.json'
					// jsonIntfile['buildVersion'] = "${fileVersion}".toString()
					// writeJSON file: './src/assets/config/config.int.json', json: jsonIntfile

					// def jsonUATfile = readJSON file: './src/assets/config/config.uat.json'
					// jsonUATfile['buildVersion'] = "${fileVersion}".toString()
					// writeJSON file: './src/assets/config/config.uat.json', json: jsonUATfile

					// def jsonCertfile = readJSON file: './src/assets/config/config.cert.json'
					// jsonCertfile['buildVersion'] = "${fileVersion}".toString()
					// writeJSON file: './src/assets/config/config.cert.json', json: jsonCertfile

					// def jsonProdfile = readJSON file: './src/assets/config/config.prod.json'
					// jsonProdfile['buildVersion'] = "${fileVersion}".toString()
					// writeJSON file: './src/assets/config/config.prod.json', json: jsonProdfile
				}
			}
		}
		stage("Build Release and Deploy"){
			when {
	      		expression { params.Environment == "RELEASE"}
	    	}
			steps{
				sh 'chmod +x ./build-release.sh'
				sh './build-release.sh'
				sh """
				rm -rf SoftwareReleases
				mkdir -p SoftwareReleases/rspsUI/rsps_${fileVersion}
				"""
				zip zipFile: "SoftwareReleases/rspsUI/rsps_${fileVersion}/rsps_${fileVersion}.zip", archive: false, dir: "dist/rsps"
				sh """
				echo DMBL=rsps_${fileVersion} >>propsfile
				"""
				wrap([$class: 'BuildUser']) {
						build (job: 'Dimensions Upload and Baseline', 
							parameters: [
								string(name: 'DMPRODUCT', value: "ITS5000"),
								string(name: 'SDACOMPONENT', value: "59803989-b407-49e1-8d9e-b718f4d2d947"),
                string(name: 'SDAAPPLICATION', value: "f8ae9b8a-bb31-41f1-ba52-4f3e62f1add1"),
                string(name: 'SDAENV', value: "f99bb5dc-7f6d-49d9-be45-db98a643219c"),
                string(name: 'SDAPROCESS', value: "10f049ac-a05e-42b9-bd45-81f745cbab7e"),
                string(name: 'DMSTATUS', value: "APPROVED"),
								string(name: 'DEPLOYME', value: "Yes"),
								string(name: 'DMPART', value: "RELEASE.A;1"),
					      string(name: 'DMTEMPLATE', value: "ITS5000_JENKINS_BL"),
					      string(name: 'DMPROJECT', value: "SOFTWARE RELEASES"),
                string(name: 'MYTAG', value: "rsps_${fileVersion}"),
								string(name: 'DMWORKSPACE', value: "${WORKSPACE}")
							],
							wait: true
						)
						}       
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
    		stage("Deploy to UAT"){
			when {
	      		expression { params.Environment == "RELEASE"}
	    	}
			steps{
				script {
                    def userInput = true
                    def didTimeout = false
                    try {
                        timeout(time: 30, unit: 'MINUTES') { // change to a convenient timeout for you
                            userInput = input(
                            id: 'Proceed1', message: 'Deploy to UAT?', parameters: [
                            [$class: 'BooleanParameterDefinition', defaultValue: true, description: '', name: 'Please choose the following option below:']
                            ])
                        } 
                    }   catch(err) { // timeout reached or input false
                            def user = err.getCauses()[0].getUser()
                            if('SYSTEM' == user.toString()) { // SYSTEM means timeout.
                                didTimeout = true
                            } else {
                                userInput = false
                                echo "Aborted by: [${user}]"
                            }
                        }
                         if (didTimeout) {
                            echo "No input was received before timeout!"
                        } else if (userInput == true) {
                            echo "Deploying to UAT!"
							wrap([$class: 'BuildUser']) {
								build (job: 'Downstream_DA_Deployment', 
									parameters: [
										string(name: 'DMPRODUCT', value: "ITS5000"),
										string(name: 'SDACOMPONENT', value: "59803989-b407-49e1-8d9e-b718f4d2d947"),
										string(name: 'SDAAPPLICATION', value: "f8ae9b8a-bb31-41f1-ba52-4f3e62f1add1"),
										string(name: 'SDAENV', value: "40bf25f4-209c-482a-90cb-d10e1e5bb7ec"),
										string(name: 'SDAPROCESS', value: "10f049ac-a05e-42b9-bd45-81f745cbab7e"),
										string(name: 'DEPLOYME', value: "Yes"),
										string(name: 'DMBL', value: "rsps_${fileVersion}")
									],
									wait: true
								)
							} 							
                        } else {
                            echo "Deploy to UAT not needed!"
                        } 				
				}
			} 
		} 
		stage('Deploy to DEV') {	
			when {
		  		expression { params.Environment == "DEV"}
			}
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
