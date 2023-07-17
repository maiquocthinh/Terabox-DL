const TreeView = (function () {
    function render(data, rootList) {
        for (const item of data) {
            if (item.isDir) {
                // create <li class="folder">
                const li = document.createElement("li")
                li.className = "folder"
                li.setAttribute("opened", "true")

                // create <div class="folder-header">
                const folderHeaderDiv = document.createElement("div")
                folderHeaderDiv.className = "folder-header"
                folderHeaderDiv.innerHTML = `<span class="icon-arrow">
                                                <i class="fa-solid fa-caret-right hidden"></i>
                                                <i class="fa-solid fa-caret-down"></i>
                                            </span>
                                            <span class="icon-folder">
                                                <i class="fa-solid fa-folder hidden"></i>
                                                <i class="fa-solid fa-folder-open"></i>
                                            </span>
                                            <span class="folder-name">${item.name}</span>`

                // append <ul class="children"> to <li class="folder">
                li.appendChild(folderHeaderDiv)

                // If the folder has children, recursively render them
                if (item.children && item.children.length > 0) {
                    // create <ul class="children">
                    const childrenUl = document.createElement("ul")
                    childrenUl.className = "children"
                    // recursively render
                    render(item.children, childrenUl)
                    // append <ul class="children"> to <li class="folder">
                    li.appendChild(childrenUl)
                }

                // append to rootList
                rootList.appendChild(li)
            } else {
                // create <li class="file">
                const li = document.createElement("li")
                li.className = "file"

                li.innerHTML = `<i class="fa-solid ${getFileIcon(item.category)}"></i>
                                <span class="file-name">${item.name}</span>`

                // create <button class="size-and-download">
                const sizeAndDownloadDiv = document.createElement("div")
                sizeAndDownloadDiv.className = "size-and-download"
                sizeAndDownloadDiv.innerHTML = `<span class="file-size">${item.size}</span>`

                // create <button class="file-download">
                const fileDownloadBtn = document.createElement("button")
                fileDownloadBtn.className = "file-download"
                fileDownloadBtn.innerHTML = '<i class="fa-solid fa-download"></i>'
                fileDownloadBtn.onclick = item.downloadAction

                // append fileDownloadBtn to li
                sizeAndDownloadDiv.appendChild(fileDownloadBtn)
                li.appendChild(sizeAndDownloadDiv)

                // append li to rootList
                rootList.appendChild(li)
            }
        }
    }

    function getFileIcon(category) {
        switch (category) {
            case 1:
                return "fa-file-video"
            case 2:
                return "fa-file-audio"
            case 3:
                return "fa-file-image"
            case 4:
                return "fa-file-lines"
            default:
                return "fa-file"
        }
    }

    function binding() {
        const listFuncs = []
        const listElms = []

        const folderHeaders = document.querySelectorAll(".folder-header")
        folderHeaders.forEach(function (folderHeader) {
            const parent = folderHeader.parentNode
            const children = parent.querySelector(".children")
            const iconArrow = folderHeader.querySelector(".icon-arrow")
            const iconFolder = folderHeader.querySelector(".icon-folder")
            if (!!children) {
                function cb() {
                    const isOpen = parent.getAttribute("opened") == "true"
                    parent.setAttribute("opened", !isOpen)
                    children.classList.toggle("hidden", isOpen)
                    iconArrow.querySelector(".fa-caret-right").classList.toggle("hidden", !isOpen)
                    iconArrow.querySelector(".fa-caret-down").classList.toggle("hidden", isOpen)
                    iconFolder.querySelector(".fa-folder").classList.toggle("hidden", !isOpen)
                    iconFolder.querySelector(".fa-folder-open").classList.toggle("hidden", isOpen)
                }
                folderHeader.addEventListener("click", cb)
                listFuncs.push(cb)
                listElms.push(folderHeader)
            } else {
                iconArrow.classList.add("hidden")
            }
        })

        return function unbinding() {
            for (let index = 0; index < listFuncs.length; index++) {
                const func = listFuncs[index]
                const elm = listElms[index]
                elm.removeEventListener("click", func)
            }
        }
    }

    let unbinding = function () {}

    return function (data, treeViewElement) {
        // remove event listener & clear treeViewElement
        unbinding()
        treeViewElement.innerHTML = ""

        // create rootList
        const rootList = document.createElement("ul")
        rootList.className = "root"

        // render tree view
        render(data, rootList)

        // append rootList to treeView
        treeViewElement.appendChild(rootList)

        // binding
        unbinding = binding()
    }
})()

function formatStorageSize(bytes) {
    const KB = 1024
    const MB = KB * 1024
    const GB = MB * 1024

    if (bytes >= GB) {
        const gigabytes = bytes / GB
        return gigabytes.toFixed(2) + "GB"
    } else {
        const megabytes = bytes / MB
        return megabytes.toFixed(2) + "MB"
    }
}
