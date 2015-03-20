var te_dsp = {
    renderBK: function (tag) {
        if (tag["container"] == undefined || tag["container"] == null) {
            document.write("<div id='te_dsp_" + tag.pid + "' style='height: @@HEIGHT@@; width: @@WIDTH@@;'></div>");
            tag.container = document.getElementById('te_dsp_' + tag.pid);
        }
        //fix IE10 onload issue
        if (navigator.userAgent.indexOf("MSIE 10") > -1) { setTimeout(function () { te_dsp.doRenderBK(tag); }, 5); } else { te_dsp.doRenderBK(tag); }
    },
    doRenderBK: function (tag) {
        if (window['bk_results'] != undefined) {
            var cats = {};
            var camps = {};
            var sep = "";
            for (var iCamp = 0; iCamp < bk_results["campaigns"].length; iCamp++) {
                var camp = bk_results["campaigns"][iCamp];
                camps[camp["campaign"]] = "|";
                for (var iCat = 0; iCat < camp["categories"].length; iCat++) {
                    var cat = camp["categories"][iCat];
                    cats[cat["categoryID"]] = "";
                    camps[camp["campaign"]] += cat["categoryID"] + "|";
                }
            }
            tag.overrides += "&x_bk=1&x_bk_cats=|";
            for (var cat in cats) {
                tag.overrides += cat + "|";
            }
            tag.overrides += "&x_bk_camps=|";
            for (var camp in camps) {
                tag.overrides += camp + "|";
            }
            tag.overrides = tag.overrides.replace('{overrides}', '');
            tag.click = tag.click.replace('{click}', '');
        } else {
            tag.overrides += "&x_bk=0";
        }
        //fix IE7&8 Flash Issues
        if (navigator.userAgent.indexOf("MSIE 8") > -1 || navigator.userAgent.indexOf("MSIE 7") > -1) { tag.type = "image"; }
        te_dsp.render(tag);
    },
    render: function (tag) {
        if (tag.domain.substr(0, 4) == 'http') { tag.domain = tag.domain.split('/')[2]; }
        if (tag["click"] == undefined || tag["click"] == null) { tag.click = ""; }
        switch (tag.type) {
            case "image":
                var clickURL = 'http://' + tag.domain + '/click?spacedesc=' + tag.pid;
                if (tag.click != "") { clickURL = tag.click + clickURL; }
                var click = te_dsp.createElement("a", {
                    href: clickURL,
                    target: tag.target
                });
                click.appendChild(te_dsp.createElement("img", {
                    src: "//" + tag.domain + tag.path + "/image?spacedesc=" + tag.pid + tag.overrides,
                    height: tag.height,
                    width: tag.width,
                    alt: "Click Here",
                    border: 0
                }));
                tag.container.appendChild(click);
                break;
            case "jscript":
                //tag.container.appendChild(te_dsp.createElement("script", {
                //    src: "//" + tag.domain + "/jscript?spacedesc=" + tag.pid + "&target=" + tag.target + tag.overrides + "&@CPSC@=" + tag.click,
                //    type: "text/javascript"
                //}));
                document.write("<script src='//" + tag.domain + tag.path + "/jscript?spacedesc=" + tag.pid + "&target=" + tag.target + tag.overrides + "&@CPSC@=" + tag.click + "' type='text/javascript'></script>");
                break;
            case "iframe":
                tag.container.appendChild(te_dsp.createElement("iframe", {
                    src: "//" + tag.domain + tag.path + "/iframe?spacedesc=" + tag.pid + "&target=" + tag.target + tag.overrides + "&@CPSC@=" + tag.click,
                    scrolling: "No",
                    frameborder: "0",
                    height: tag.height,
                    width: tag.width,
                    marginHeight: "0",
                    marginWidth: "0"
                }));
                break;
        }
    },
    createElement: function (name, attrs) {
        var node = document.createElement(name), attr;

        for (attr in attrs) {
            if (attrs.hasOwnProperty(attr)) {
                node.setAttribute(attr, attrs[attr]);
            }
        }

        return node;
    },
    debug: true,
    console: function (message) { }
}