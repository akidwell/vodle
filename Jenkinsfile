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
		      		bat("npm run ng build --prod --aot")
		      }
				)
    	} 
		}
		/*stage("Create Tag"){
		 when {
	      expression { params.Environment == "RELEASE"}
	    }
		  steps{
		  	dir('IUS_ACIS'){
		  	  sh ("git config user.email 'buildmaster'")
   			  sh ("git config user.name 'buildmaster'")
				  sh ("git tag -d ${VersionTag} || true")
		      sh ("git tag -a ${VersionTag} -m \"Release Build ${fileVersion}\"")	    
		      sh ("git push origin --tags")
        }
        */
		dir('SoftwareReleases') {
			deleteDir()
			}
			bat("mkdir SoftwareReleases\\IUS\\IUS_${fileVersion}")
      }
		}
	  stage('Copy Library') {	 
			steps{
				bat("xcopy /y .\\BuildScripts\\Library\\*.* .\\Archive\\*.*")
			}
		}
		stage('Copy INI') {	
			steps{
			  powershell(returnStdout: true, script:".\\BuildScripts\\CreateINI.ps1 -version ${fileVersion} -buildDate '${buildDate}' -environment ${params.Environment}") 
			}
		}
		stage('Zip') {	
			steps{
				zip zipFile: "IUS_${fileVersion}.zip", archive: false, dir: "Archive"
			}
		}
		stage('Archive') {	
			steps{
				archiveArtifacts artifacts: "IUS_${fileVersion}.zip", fingerprint: true
			}
		}
		stage('Deploy Dev'){
			when {
	      expression { params.Environment == "DEV"}
	    }
		steps{
			wrap([$class: 'MaskPasswordsBuildWrapper']){
			bat "net use \\\\cvgisln01.nas.afg /user:${env.UNAME} ${env.PWORD}"
			}
			bat("xcopy /y .\\Archive\\*.* \\\\cvgisln01.nas.afg\\apps\\RiskSolutions\\Dev\\IUS")
			bat "net use /delete \\\\cvgisln01.nas.afg"
			}
		}
		stage('Copy Zip') {
			when {
	      expression { params.Environment == "RELEASE"}
	    }
			steps{
				bat("xcopy /y *.zip .\\SoftwareReleases\\IUS\\IUS_${fileVersion}")
			}
		}
		stage('Dimensions') {
			when {
		  expression { params.Environment == "RELEASE"}
		}
			steps{
				build job: 'Dimensions_Upload_And_Baseline', parameters: [string(name: "DMBL", value: "IUS_${fileVersion}"), string(name:"DMWORKSPACE", value: "${WORKSPACE}"), string(name:"DMPART", value: "WINSWREL.A;1"), string(name:"DMTEMPLATE", value: "ITS5000_WINJENKINS_BL"), string(name:"DMSTATUS", value: "APPROVED"), string(name:"DMPRODUCT", value: "ITS5000"), string(name:"SDACOMPONENT", value: "c39efa30-e6c0-48bd-b396-9f5bd95dc003")]
			}
		}
	}
}
