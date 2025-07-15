let deffinition=document.getElementById("def");
let WordInput=document.getElementById("WordInput");
let proBtn=document.getElementById("pro");
let posList=document.getElementById("posList");
let copy=document.getElementById("copy");
let copyP=document.getElementById("copyP");
let audiosrc=""
function getDefiniton(){
    const query=WordInput.value.trim();
    if(query===""){
        console.log("no word written");
        deffinition.textContent="Please enter a Word"
        return ;
    }
    posList.textContent="";
    let url= "https://api.dictionaryapi.dev/api/v2/entries/en/" + query;
    fetch(url)
    .then(res=>{
        if(!res.ok)throw new Error("Word Not Found");
        return res.json();
    })
    .then(data=>{
        if(data[0]&&data[0].meanings&&data[0].meanings[0].definitions){
            let definitions=data[0].meanings[0].definitions;
            if(definitions.length>1){
                deffinition.textContent=definitions[1].definition;
            }else{
                deffinition.textContent=definitions[0].definition;
            }
            if(data[0].phonetics&&data[0].phonetics.length>0){
                let phoneticsWithAudio=data[0].phonetics.find(p=>p.audio&&p.audio.length>0);
                if(phoneticsWithAudio){
                    audiosrc=phoneticsWithAudio.audio.startsWith('https')?phoneticsWithAudio.audio:'https'+phoneticsWithAudio.audio;
                }else{
                    audiosrc="";
                }
            }else{
                audiosrc="";
            }
            data[0].meanings.forEach(element => {
                let li= document.createElement("li");
                if(element.definitions&&element.definitions.length>0){
                    li.innerHTML=`<span class="des_li">${element.partOfSpeech}</span> : ${element.definitions[0].definition}`;
                }else{
                    li.textContent=`${element.partOfSpeech} : No Definition available`;
                }
                posList.appendChild(li);
            });
        }else{
            deffinition.textContent="Deffinition Not Found"
        }
    })
    .catch(err=>{
        console.error(err);
        deffinition.textContent="Word not found or error occured";
    });
}
proBtn.addEventListener("click",()=>{
    if(audiosrc){
        let audio = new Audio(audiosrc);
        audio.play();
    }else{
        alert("Pronunciation audio not available.")
    }
})
function copyText(){
    let text=deffinition.textContent;
    navigator.clipboard.writeText(text);
        alert("text Copied");
}
function copyTextP(){
    let text=posList.textContent;
    navigator.clipboard.writeText(text)
    .then(res=>{
        alert("text Copied");
    })
}
copy.addEventListener("click",copyText);
copyP.addEventListener("click",copyTextP);
