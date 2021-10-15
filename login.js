const puppeteer = require("puppeteer");

let tab;
let idx;
let gCode;

let browserOpenPromise = puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
});


browserOpenPromise.then(function(browser){
    let pagesPromise = browser.pages();
    return pagesPromise;
}).then(function(pages){
    let page = pages[0];
    tab = page;
    let pageOpenedPromise = page.goto("https://www.hackerrank.com/auth/login?h_l=body_middle_left_button&h_r=login");
    return pageOpenedPromise;
}).then(function(){
    let idTypedPromise = tab.type('#input-1','xoref60906@silbarts.com');
    return idTypedPromise;
}).then(function(){
    let pwTypedPromise = tab.type('#input-2','12345678');
    return pwTypedPromise;
}).then(function(){
    let loginButtonClickedPromise = tab.click('.ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled');
    return loginButtonClickedPromise;
}).then(function(){
    let waitPromise = tab.waitForSelector('#base-card-1-link', {visible:true});
    return waitPromise;
}).then(function(){
    let ipBittonClickedPromise = tab.click('#base-card-1-link');
    return ipBittonClickedPromise;
}).then(function(){
    let waitPromise = tab.waitForSelector('a[data-attr1="warmup"]', {visible:true});
    return waitPromise;
}).then(function(){
    let warmupClickedPromise = tab.click('a[data-attr1="warmup"]');
    return warmupClickedPromise;
}).then(function(){
    let waitPromise = tab.waitForSelector('.js-track-click.challenge-list-item', {visible:true});
    return waitPromise;
}).then(function(){
    let allQuestionsPromise = tab.$$('.js-track-click.challenge-list-item');
    return allQuestionsPromise;
}).then(function(allQuestions){
    let allLinksPromise = [];
    for(let i=0;i<allQuestions.length;i++){
        let linkAllPendingPromise = tab.evaluate(function(elem){return elem.getAttribute('href');}, allQuestions[i]);
        allLinksPromise.push(linkAllPendingPromise);
    }
    let allQuestionsPromise = Promise.all(allLinksPromise);
    return allQuestionsPromise;
}).then(function(allLinks){
    let completeLinks = []
    for(let i=0;i<allLinks.length;i++){
        let link = "https://www.hackerrank.com" + allLinks[i];
        completeLinks.push(link);
    }
    let questionSolvedPromise = solveQuestion(completeLinks[0]);
    for(let i=1;i<allLinks.length;i++){
        questionSolvedPromise = questionSolvedPromise.then(function(){
            return solveQuestion(completeLinks[i]);
        })
    }
    
}).then(function(){
    console.log("All Questions Solved !!!");
})
.catch(function(error){
    console.log(error);
})

function waitAndClick(selector){
    return new Promise(function(resolve, reject){

        let waitKaPromise = tab.waitForSelector(selector, {visible:true});
        waitKaPromise.then(function(){
            let clickedPromise = tab.click(selector);
            return clickedPromise;
        }).then(function(){
            return resolve();
        }).catch(function(error){
            return reject(error);
        })

    });
}

function solveQuestion(qLink){
    return new Promise(function(resolve,reject){
        let questionGoToPromise = tab.goto(qLink);
        questionGoToPromise.then(function(){
            console.log("opened question !!!");
        }).then(function(){
            let waitPromise = waitAndClick('a[data-attr2="Editorial"]');
            return waitPromise;
        })
        // .then(function(){
        //     let lockBtnPromise = handleLockBtn();
        //     return lockBtnPromise
        // })
        .then(function(){
            let codePromise = getCode();
            return codePromise;
        })
        .then(function(){
            let waitPromise = tab.goto(qLink);
            return waitPromise;
        })
        .then(function(){
            let codePastedPromise = pasteCode();
            return codePastedPromise;
        })
        .then(function(){
            let submitClickButtonPromise = tab.click(".ui-btn.ui-btn-normal.ui-btn-primary.pull-right.hr-monaco-submit.ui-btn-styled");
            return submitClickButtonPromise;
        }).then(function(){
            resolve();
        })
        .catch(function(error){
            reject(error);
        })
    })
}

function getCode(){
    return new Promise(function(resolve, reject){
        let waitPromise = tab.waitForSelector(".hackdown-content h3");
        waitPromise.then(function(){
            //console.log("Get Code");
            let allCodesNamesPromise = tab.$$('.hackdown-content h3');
            return allCodesNamesPromise;
        }).then(function(allCodesName){
            let allCodesNameP = [];
            for(let i=0;i<allCodesName.length;i++){
                let namePromise = tab.evaluate(function(elem){
                    return elem.textContent;
                },allCodesName[i]);
                allCodesNameP.push(namePromise);
            }
            let promiseAllCodeNames = Promise.all(allCodesNameP);
            return promiseAllCodeNames;
        }).then(function(allCodesName){
            for(let i=0;i<allCodesName.length;i++){
                if(allCodesName[i] == "C++"){
                    idx = i;
                    break;
                }
            }
            let allCodesKaPromise = tab.$$('.hackdown-content .highlight');
            return allCodesKaPromise;
        }).then(function(allCodes){
            let code = allCodes[idx];
            let codePromise = tab.evaluate(function(elem){
                return elem.textContent;
            },code);
            return codePromise;
        }).then(function(code){
            //console.log(code);
            gCode = code;
            resolve();
        }).catch(function(error){
            reject(error);
        });
    });
}

function pasteCode(){
    return new Promise(function(resolve, reject){
        let waitAndClickPromise = waitAndClick('.checkbox-input');
        waitAndClickPromise.then(function(){
            let codeTypedPromise = tab.type('#input-1', gCode);
            return codeTypedPromise;
        }).then(function(){
            let ctrlKeyHoldPromise = tab.keyboard.down("Control");
            return ctrlKeyHoldPromise;
        }).then(function(){
            let aKeyPressPromise = tab.keyboard.press("a");
            return aKeyPressPromise;
        }).then(function(){
            let xKeyPressPromise = tab.keyboard.press("x");
            return xKeyPressPromise;
        }).then(function(){
            let codeBoxClickedPromise = tab.click('.monaco-editor.no-user-select .vs');
            return codeBoxClickedPromise;
        }).then(function(){
            let aKeyPressPromise = tab.keyboard.press("a");
            return aKeyPressPromise;
        }).then(function(){
            let vKeyPressPromise = tab.keyboard.press("v");
            return vKeyPressPromise;
        }).then(function(){
            console.log(gCode);
            resolve();
        }).catch(function(error){
            console.log("Erroe occured");
            reject(error);
        })
    })
}

function handleLockBtn(){
    return new Promise(function(resolve, reject){
        let waitAndClickPromise = waitAndClick('.ui-btn.ui-btn-normal.ui-btn-primary.ui-btn-styled');
        waitAndClickPromise.then(function(){
            console.log("Button has been kciked");
            resolve();
        }).catch(function(error){
            console.log("Lock Button has not been kciked");
            resolve();
        });
    });
}