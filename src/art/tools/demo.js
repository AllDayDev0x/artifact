exports.demo = function (vars) {

    const scetchid = document.getElementById("scetchid");
    scetchid.innerHTML = " " + Number(vars.sketchId);

    const ifrm = document.createElement("iframe");
    ifrm.setAttribute("src", "/dist/shape" + vars.sketchId.toString() + ".html?hash=" + vars.hash);
    ifrm.style.width = "100%";
    ifrm.style.height = "100%";
    document.getElementById("container").appendChild(ifrm);

    const collName = document.getElementById("coll-name");
    collName.innerHTML = vars.demoData.static.name;

    const sketchIds = document.getElementById("sketchIdCont");
    for (const child of sketchIds.children) {
        child.classList.remove("selected");
    }
    const selectedLink = document.getElementsByClassName("link" + vars.sketchId)[0];
    selectedLink.classList.add("selected");

    const regenerate = document.getElementById("regenerate");
    document.addEventListener("keydown", (event) => {
        const key = event.key;
        switch (key.toLowerCase()) {
            case 'r':
                regenerate.click();
                event.preventDefault();
                event.stopPropagation();
                break;
        }
    });


    // Specs
    const specs = document.getElementById("specs");
    /*
    <h4>Başlık</h4>
    <div>
        <strong>Konu</strong>
        <span>Açıklama</span>
    </div>
    */
    let val, Div, H4, Strong, Span;

    H4 = document.createElement("h4");
    H4.innerHTML = "Selected Colors";
    specs.append(H4);
    const DivSC = document.createElement("div");
    DivSC.classList.add("selected-colors");

    for (let key in vars.colors) {
        val = vars.colors[key];
        Div = document.createElement("div");
        Div.style.backgroundColor = val;

        DivSC.append(Div);
    }
    specs.append(DivSC);


    H4 = document.createElement("h4");
    H4.innerHTML = "Static";
    specs.append(H4);
    for (let key in vars.demoData.static) {
        val = vars.demoData.static[key];
        Div = document.createElement("div");
        Strong = document.createElement("strong");
        Span = document.createElement("span");
        Strong.innerHTML = key;
        Span.innerHTML = val;
        Div.append(Strong);
        Div.append(Span);
        specs.append(Div);
    }

    H4 = document.createElement("h4");
    H4.innerHTML = "Stats";
    specs.append(H4);
    for (let key in vars.demoData.stats) {
        val = vars.demoData.stats[key];
        Div = document.createElement("div");
        Strong = document.createElement("strong");
        Span = document.createElement("span");
        Strong.innerHTML = key;
        Span.innerHTML = val;
        Div.append(Strong);
        Div.append(Span);
        specs.append(Div);
    }


}