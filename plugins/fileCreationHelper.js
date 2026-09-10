var plugin = {
  metadataVersion: "1.0.0",
  id: "fileCreationHelper",
  name: "File Creation Helper",
  version: "1.0.0",
  author: "Gregor Schütz",
  email: "gregor.b.schuetz@gmail.com",
  website: "",
  description: "This plugin helps with the creation of files/resources. You can define a template and type right here and the filename in the messagebar.",
  settings: {
    fileType: {
      text: "Type",
      type: "radio",
      scope: "browser",
      options: [
        { value: "edmx", label: "EDMX" },
        { value: "groovy", label: "Groovy" },
        { value: "jar", label: "JAR" },
        { value: "js", label: "JavaScript" },
        { value: "mmap", label: "Message Mapping" },
        { value: "opmap", label: "Operation Mapping" },
        { value: "wsdl", label: "WSDL" },
        { value: "xsd", label: "XSD" },
        { value: "xslt", label: "XSLT" },
      ],
    },
    fileTemplate: { text: "Template", type: "textinput", scope: "browser" },
  },
  messageSidebarContent: {
    static: true,
    onRender: (pluginHelper, settings) => {
      var div = document.createElement("div");
      div.innerText = "Filename \r\n";
      var input = document.createElement("input");
      var button = document.createElement("button");
      button.innerHTML = "create";

      button.onclick = async (x) => {
        if (settings["fileCreationHelper---fileType"] && settings["fileCreationHelper---fileTemplate"] && input.value) {
          try {
            const requestUrl = `/${pluginHelper.urlExtension + cpiData.runtimePathExtension}odata/api/v1/IntegrationDesigntimeArtifacts(Id='${pluginHelper.currentArtifactId}',Version='active')/Resources`;
            const base64Template = btoa(unescape(encodeURIComponent(settings["fileCreationHelper---fileTemplate"])));
            const filePayload = {
              Name: input.value + "." + settings["fileCreationHelper---fileType"],
              ResourceType: settings["fileCreationHelper---fileType"],
              ResourceContent: base64Template,
            };

            const createResponse = await makeCallPromise("POST", requestUrl, false, "application/json", JSON.stringify(filePayload), true, "application/json;charset=UTF-8", true);
            if (typeof createResponse === "object" && createResponse && createResponse.successful === false) {
              throw new Error(createResponse.statusText || "Request failed while creating the file.");
            }

            showToast("File created successfully.", "", "success");
          } catch (error) {
            console.error(error);
            showToast(error.message || "File creation failed.", "", "error");
          }
        } else if (!input.value) {
          showToast("Please enter a filename.", "", "error");
        } else if (!settings["fileCreationHelper---fileType"] || !settings["fileCreationHelper---fileTemplate"]) {
          showToast("There is no file type or template defined for this plugin. Please define both in the plugin settings.", "", "error");
        }
      };

      div.appendChild(input);
      div.appendChild(button);

      return div;
    },
  },
};

pluginList.push(plugin);
