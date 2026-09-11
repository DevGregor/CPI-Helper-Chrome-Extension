var plugin = {
  metadataVersion: "1.0.0",
  id: "versionHistory",
  name: "Version History",
  version: "1.0.0",
  author: "Gregor Schütz",
  email: "gregor.b.schuetz@gmail.com",
  website: "",
  description: "Displays the version history for an iFlow within the editor",
  settings: {},
  messageSidebarContent: {
    static: true,
    onRender: (pluginHelper, settings) => {
      var div = document.createElement("div");
      var button = document.createElement("button");
      button.innerHTML = "view";

      button.onclick = async (x) => {
        const urlForWorkspace = `https://${pluginHelper.tenant}/api/1.0/workspace`;
        var dataOfWorkspaces = JSON.parse(await makeCallPromise("GET", urlForWorkspace, false));
        const workspace = dataOfWorkspaces.find((entry) => entry.technicalName === pluginHelper.currentPackageId).id;

        const urlForArtifactsInWorkspace = `https://${pluginHelper.tenant}/api/1.0/workspace/${workspace}/artifacts`;
        var dataOfArtifactsInWorkspace = JSON.parse(await makeCallPromise("GET", urlForArtifactsInWorkspace, false));
        const artifact = dataOfArtifactsInWorkspace.find((entry) => entry.name === pluginHelper.currentIflowId).id;

        const urlForVersionHistory = `https://${pluginHelper.tenant}/api/1.0/workspace/${workspace}/artifacts/${artifact}?versionhistory=true&webdav=REPORT`;
        var dataOfVersionHistory = JSON.parse(await makeCallPromise("PUT", urlForVersionHistory, false, null, null, true));

        const popupContent = document.createElement("div");
        if (!dataOfVersionHistory || dataOfVersionHistory.length === 0) {
          popupContent.innerHTML = "<p>No version history found.</p>";
        } else {
          let tableHtml = ` <table class="ui celled table"> 
                              <thead> 
                                <tr> 
                                  <th>Comment</th> 
                                  <th>Semantic Version</th> 
                                  <th>Technical Version</th> 
                                  <th>Created Date</th> 
                                  <th>Created By</th> 
                                  <th>State</th> 
                                </tr> 
                              </thead><tbody> `;
          dataOfVersionHistory.forEach((version) => {
            const createdDate = new Date(Number(version.createdDate)).toLocaleString();
            tableHtml += ` <tr> 
              <td data-label="Comment">${version.comment ?? ""}</td> 
              <td data-label="Semantic Version">${version.semanticVersion ?? ""}</td> 
              <td data-label="Technical Version">${version.technicalVersion ?? ""}</td> 
              <td data-label="Created Date">${createdDate}</td> 
              <td data-label="Created By">${version.createdBy ?? ""}</td> 
              <td data-label="State">${version.state ?? ""}</td> 
            </tr> `;
          });
          tableHtml += ` </tbody> </table> `;
          popupContent.innerHTML = tableHtml;
        }
        pluginHelper.functions.popup(popupContent, "Version History");
      };

      div.appendChild(button);

      return div;
    },
  },
};

pluginList.push(plugin);
