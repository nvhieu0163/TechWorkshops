// call api to summarize
function summarize(text) {
  url = "http://localhost:8000/summarize/"

  if (text.length < 60) {
    alert('Your text is too short!');
    document.getElementById("summarized-text").textContent = text;
    document.getElementById("text").textContent = text;

  } else {
    $.ajax(url, {
      type: 'POST',
      data: JSON.stringify({text: text}),
      processData: false,
      contentType: 'application/json',
      success: function (data, status, xhr) {
        console.log(data.summarized_text);
        document.getElementById("summarized-text").textContent = data.summarized_text;
        document.getElementById("text").textContent = text;
      }
    });
  }

  // fetch(url, {
  //   headers: {
  //     'Accept': 'application/json',
  //     'Content-Type': 'application/json'
  //   },
  //   method: "POST",
  //   body: JSON.stringify({text: text})
  // })
  // .then(response => {
  //     if (!response.ok) {
  //       return 'Failed to summarize. Try again!';
  //     }
  // })
  // .then(data => {
  //   data = data.replace(/\{|\}|\"/gm,'');
  //   result = data.split("\:");
  //   return result[1];
  // })
  // .catch(error => {
  //   return 'Failed to summarize. Try again!';
  // })
}

// execute a script on the current tab
chrome.tabs.executeScript( {
    // get selected text and convert to a string
    code: "window.getSelection().toString();"
}, function(selection) {
    // trim leading and trailing spaces, replace new lines with spaces, remove any characters that aren't in the algorithm, then reduce any remaining consecutive spaces to single spaces
    var text = selection[0].trim().replace(/(\r\n|\n|\r)/gm, ' ').replace(/[^a-zA-Z.!? ]/g, '').replace(/\s\s+/g, ' ');

    // if there is selected text, run function and inject result
    if (text.length > 0) { // if not, provide usage instructions;
      // populate HTML main
      document.getElementsByTagName("main")[0].innerHTML =
        `
        <div class="accordion" id="accordion">
          <div class="card">
            <div class="card-header" id="headingOne">
              <h5 class="mb-0">
                <button class="btn" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                  <b class="text-dark">Summarized text</b>
                </button>
              </h5>
            </div>
            <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
              <div id="summarized-text" class="card-body">Summarizing...</div>
            </div>
          </div>

          <div class="card">
            <div class="card-header" id="headingTwo">
              <h5 class="mb-0">
                <button class="btn collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                  <b class="text-dark">Original Text</b>
                </button>
              </h5>
            </div>
            <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
              <div class="card-body">
                <p id="text"></p>
                <hr>
                <p><em>Note: text is stripped of characters other than a-z/A-Z, '.', '?', '!' and spaces, and consecutive spaces and line breaks are reduced to a single space.</em></p>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header" id="headingThree">
              <h5 class="mb-0">
                <button class="btn collapsed" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                  <b class="text-dark">Noted Instructions for Use</b>
                </button>
              </h5>
            </div>
            <div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordion">
              <div class="card-body">
                <p>
                  <em> 
                  * Select text then click the icon of extension to summarize. Your summarized text will be showed after few seconds.<br>
                  * The original text is the text you selected, which filtered out the pictures and preprocessed automatically. 
                  However, the input and output maxium token is 768 and 60 respectively.<br>
                  * The only support language is English. Maybe we update the other in next versions.
                  </em>
                </p>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header" id="headingFour">
              <h5 class="mb-0">
                <button class="btn collapsed" type="button" data-toggle="collapse" data-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                  <b class="text-dark">About us</b>
                </button>
              </h5>
            </div>
            <div id="collapseFour" class="collapse" aria-labelledby="headingFour" data-parent="#accordion">
              <div class="card-body" style="text-align: center">
                <p> Technology Workshops - UET</p>
                <p> Projects of Group 3 - AI for text</p>
                <p> Lectuer: Assoc. Prof. Le Sy Vinh</p>
                <hr>
                <span style="font-size: 90%; text-align: left">
                  <em>
                  Since 2022<br>
                  Contact us: Đại học Công nghệ, 144 Xuân Thủy, HN
                  </em>
                </span>
              </div>
            </div>
          </div>
        </div>
        `;

      summarize(text);
    } 
});
