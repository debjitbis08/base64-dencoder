(function (window, document) {
    function getElementById(elementId) {
        return document.getElementById(elementId);
    }

    var encodeBox = getElementById("b64-e");
    var decodeBox = getElementById("b64-d");
    var pFClipCont = getElementById("paste-from-clipboard-container");
    var clearInputBtn = getElementById("clear-input")
    var GRANTED = "granted";
    var HIDDEN = "hidden";

    getElementById("decode-btn").addEventListener("click", function () {
        var base64data = encodeBox.value;
        if (base64data === "") {
            console.log("Enter some data in input.");
        }

        decodeBox.value = window.atob(base64data);
    });

    try {
        navigator.permissions
            .query({
                name: "clipboard-read"
            })
            .then(permissionStatus => {
                if (permissionStatus.state === GRANTED) {
                    pFClipCont.removeAttribute(HIDDEN);
                }
                // Listen for changes to the permission state
                permissionStatus.onchange = () => {
                    if (permissionStatus.state === GRANTED) {
                        pFClipCont.removeAttribute(HIDDEN);
                    } else {
                        pFClipCont.setAttribute(HIDDEN, HIDDEN);
                    }
                };
            });
    } catch (e) {
    }

    getElementById("paste-from-clipboard")
        .addEventListener("click", function () {
            encodeBox.focus();
            encodeBox.select();
            var result = document.execCommand("paste");
            if (result === "unsuccessful" || result === false) {
                if (window.clipboardData) {
                    encodeBox.value = window.clipboardData.getData("text/plain");
                }
                if (window.navigator.clipboard) {
                    navigator.clipboard
                        .readText()
                        .then(function (text) {
                            encodeBox.value = text;
                        })
                        .catch(function (err) {
                            console.error("Failed to read clipboard contents: ", err);
                        });
                }
            }
        });

    clearInputBtn.addEventListener("click", function () {
        encodeBox.value = "";
    });
})(window, document);
