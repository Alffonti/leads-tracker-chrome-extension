// If possible, use const. If not, use let.
let myLeads = [] // `let` variables are supposed to be reassigned
const inputEl = document.getElementById('input-el') // `const` variables can't be reassigned
const inputBtn = document.getElementById('input-btn')
const ulEl = document.getElementById('ul-el');
const deleteBtn = document.getElementById('delete-btn');
const tabBtn = document.getElementById('tab-btn');

// in order to render leads when refreshing the page, first, I need to store them in a local storage and, second, I need to get them from the local storage 
const leadsFromLocalStorage = JSON.parse(localStorage.getItem('myLeads')) // converting the 'myLeads' string value from the localStorage to an array

if (leadsFromLocalStorage){
    // the conditional is executed if the statement leadsFromLocalStorage is a truthy value (an array). If the local storage is clear, then the browser sends `null` (falsy value) and the conditional is not executed.
    myLeads = leadsFromLocalStorage
    render(myLeads) // passing the `myLeads` variable as an argument (are defined outside of the function scope) into the render() function
}

// get the URL of the current tab (of the current window) when the SAVE TAB button is clicked
tabBtn.addEventListener("click", function(){    
    // the `chrome.tabs.query` API function is only defined in the Chrome browser (and can only be executed in the content of the Chrome browser). In order to access the tab URL, I need to declare the `tabs` permission in the manifest.json file.
    chrome.tabs.query({
        active: true, 
        currentWindow: true}, 
        function(tabs){
            // console.log(tabs) // tabs = [{url: "https://www.current-tab.com/"}]
            myLeads.push(tabs[0].url) // I need to access the array first, then the first item of the array (which is an object) and, lastly, the `url` key
            localStorage.setItem("myLeads", JSON.stringify(myLeads) )
            render(myLeads)
        }
    )
})

deleteBtn.addEventListener('dblclick', function() {
    localStorage.clear() // clear the localStorage
    myLeads = [] // clear myLeads` by reassingning `myLeads` to an empty array
    render(myLeads) // clear the DOM (the list); calling the render(myLeads) function whithout having any items (leads) in the `myLeads` array, so nothing is rendered 
})

inputBtn.addEventListener('click', function() {
    myLeads.push(inputEl.value) // pushing the value from the input field into the `myLeads` array
    inputEl.value = '' // clearing out the input field with an empty string
    
    // saving the myLeads array to localStorage
    localStorage.setItem('myLeads', JSON.stringify(myLeads)) // the localStorage property only store key-value pair strings, so I need to use the store JSON.stringify() method to convert arrays into strings
    
    render(myLeads)
    // console.log( localStorage.getItem('myLeads') ) // checking the localStorage
})

//using parameters (are defined inside of the function scope) to make the function scalable and reusable
function render(leads) {
    listItems = '' // every time the function is called the rendered items are refreshed
    for (let i = 0; i < leads.length; i++) {
        // using template literals to format strings (to avoid the use of quotes for strings and instead using placeholders `${}` for JS expressions)
        // Another solution: listItems += '<li><a href="# target="_blank">' + leads[i] + '</a></li>' 
        listItems += `
        <li>
            <a href='${leads[i]}' target='_blank'>
            ${leads[i]}
            </a>
        </li>
        `
    }
    ulEl.innerHTML = listItems // using the `innerHTML` property to render HTML elements (convert strings to conventional HTML tags) on the page // excessive DOM interaction can impact the page performance, so it's better to use it once
}