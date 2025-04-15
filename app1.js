document.addEventListener("DOMContentLoaded", () => {
    const selectFolderButton = document.getElementById("select-folder");
    const transformButton = document.getElementById("transform-button");
    const selectedFolderDisplay = document.getElementById("selected-folder");
    const fullFileNamesToggle = document.getElementById("toggle-full-names");
    const keepUnderscoresToggle = document.getElementById("toggle-keep-underscores");

    let selectedFolderHandle = null;

    console.log(window.docx); // This should log the `docx` object to the console

    // Function to handle folder selection
    selectFolderButton.addEventListener("click", async () => {
        try {
            // Use the File System Access API to select a folder
            selectedFolderHandle = await window.showDirectoryPicker();
            selectedFolderDisplay.textContent = `Selected Folder: ${selectedFolderHandle.name}`;
        } catch (error) {
            console.error("Folder selection was canceled or failed.", error);
        }
    });

    // Function to recursively scan folders and generate a Word file
    transformButton.addEventListener("click", async () => {
        if (!selectedFolderHandle) {
            alert("Please select a folder first.");
            return;
        }

        const fullFileNames = fullFileNamesToggle.checked;
        const keepUnderscores = keepUnderscoresToggle.checked;

        const removeList = [
            "SFX_AMB_", "SFX_AMB_EP", "EP_", "HH_", "SFX_MG_", "SFX_INT_", "SFX_IT_",
            "SFX_SHOP_", "TT_", "01.wav", "02.wav", "bloxburg_MS4_UI_", "bburg_desktop_",
            "Bloxburg MS4 BG ", "Bloxburg_MS4_"
        ];

        const doc = new window.docx.Document({
            sections: [
                {
                    properties: {},
                    children: [
                        new window.docx.Paragraph({
                            text: `Folder Scan Report - ${new Date().toLocaleString()}`,
                            heading: window.docx.HeadingLevel.HEADING_1,
                        }),
                    ],
                },
            ],
        });

        async function writeFolder(folderHandle, level = 0) {
            for await (const entry of folderHandle.values()) {
                if (entry.kind === "directory") {
                    doc.addSection({
                        children: [
                            new window.docx.Paragraph({
                                text: `${" ".repeat(level * 2)}${entry.name}`,
                                bullet: { level },
                            }),
                        ],
                    });
                    await writeFolder(await folderHandle.getDirectoryHandle(entry.name), level + 1);
                } else {
                    let fileName = entry.name;
                    if (!fullFileNames) {
                        removeList.forEach((removeStr) => {
                            fileName = fileName.replace(removeStr, "");
                        });
                    }
                    if (!keepUnderscores) {
                        fileName = fileName.replace(/_/g, " ");
                    }
                    doc.addSection({
                        children: [
                            new window.docx.Paragraph({
                                text: `${" ".repeat((level + 1) * 2)}${fileName}`,
                                bullet: { level: level + 1 },
                            }),
                        ],
                    });
                }
            }
        }

        try {
            await writeFolder(selectedFolderHandle);

            const packer = new window.docx.Packer();
            const blob = await packer.toBlob(doc);
            const fileName = "items_in_folders_list.docx";

            // Trigger download
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();

            alert("Folder scan complete. Word file has been downloaded.");
        } catch (error) {
            console.error("An error occurred during the folder scan:", error);
            alert("An error occurred. Please check the console for details.");
        }
    });
});