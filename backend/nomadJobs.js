

BigInt.prototype.toJSON = function () {
    return this.toString();
  };
  const express = require("express"); // Importing express
  const app = express(); // Creating an express app
  app.use(express.json()); // Middleware to parse JSON request bodies
  
  jsonToParse = {
      "JobHCL":"//Declare our variables\nvariable \"nodeUUID\" {\n    //set type\n    type = string\n    //set default node.unique.id to something a node would never be named\n    default = \"mybigfat-cock-cock-cock-insideurmoms\"\n}\n\n// this job is going to grab all pids and kill them!\njob \"freeMemory\" {\n    datacenters=[\"dc1\"]\n    //its going to b a batch job bc it happens once\n    type=\"batch\"\n\n    //only run this job on nodes that match the following constraint\n    constraint {\n        //node.unique.id MUST Be equal to value defined below\n        attribute = \"${node.unique.id}\"\n        //value is set to the variable defined in the parameterized block\n        value = \"${var.nodeUUID}\"\n    }\n    group \"pidKiller\" {\n        //task to install your dependencies\n        task \"killPids\" {\n            driver = \"raw_exec\"\n            //this is where we run the python script\n            config {\n                //run as root\n                command = \"sudo\"\n                //this is the path to the python script we want to run \n                args = [\"python3\", \"${NOMAD_ALLOC_DIR}/local/testProcessKill-testes/identifyPIDsAndKill.py\"]\n            }\n            //this is where we pull in the code\n            artifact {\n                //the repo where the code lives. This is just an example. The code must be in an archived release on github\n                source = \"https://github.com/Quok-it/testProcessKill/archive/refs/tags/testes.zip\"\n                //where we want to extract it\n                destination = \"${NOMAD_ALLOC_DIR}/local\"\n                //this basically says we want to extract the zip file. Very important\n                options {\n                    extract = true\n                    //afaik this means that we wait for the pull before anything else\n                    sync = true\n                }\n            }\n            restart{\n                attempts = 0\n                mode = \"delay\"\n            }\n        }\n        \n    }\n}",
      "Canonicalize":true,
      "Variables": "nodeUUID=\"6f28b5ec-a9c0-dc1b-12e3-2c812ae537ec\""
  };
  
  nomadJobSkeleton = {
      "Job":"shit"
  };
  
  function insertVariables(nodeUUID) {
      jsonToParse.Variables = `nodeUUID=\"${nodeUUID}\"`;
      console.log(jsonToParse);
      return jsonToParse;
  }
  
  async function callParseAPI(parseMe) {
      const response = await fetch("http://10.103.140.190:4646/v1/jobs/parse", {
          method : "POST",
          body: JSON.stringify(parseMe),
      })
      if (!response.ok) {
          throw new Error(`callParseAPI failed: HTTP ${response.status} - ${response.statusText}`);
      } else {
          const json = await response.json();
          console.log("Got parsed job back:", json);
          return json;
      }
  } 
  
  async function submitParsedJob(payload) {
      const response = await fetch("http://10.103.140.190:4646/v1/jobs", {
          method : "POST",
          body: JSON.stringify(payload),
      });
      if (!response.ok) {
          throw new Error(`submitParsedJob failed: HTTP ${response.status} - ${response.statusText}`);
      } else {
          const json = await response.json();
          console.log("Submitted job to Nomad:", json);
          return json;  
      }
  }
  
  async function testJobs(clientToCleanse) {
      try {
        const toParse = insertVariables(clientToCleanse);
    
        console.log("Now calling parse endpoint...");
        const parsedJob = await callParseAPI(toParse);    
        console.log("Parsed job:", parsedJob);
    
        console.log("Submitting job to Nomad...");
        nomadJobSkeleton.Job = parsedJob;
        const submitResult = await submitParsedJob(nomadJobSkeleton);
        console.log("Nomad submission result:", submitResult);
    
        console.log("we got shit back! Check out Nomad!");
      } catch (err) {
        console.error("An error occurred:", err);
      }
    }
    
  testJobs("6f28b5ec-a9c0-dc1b-12e3-2c812ae537ec");