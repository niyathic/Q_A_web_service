$(document).ready(function () {

    var data = [];
    var activeIdx = -1;
  
    // kick off getting the questions
    getQuestions();
    // now do it  every 2.5 seconds
    setInterval(getQuestions, 2500);

    function getQuestions() {
      //       Ajax request to /api/getQuestions. on success
      //       set  the data variable equal to the response and render
      //       out the question previews (by calling renderPreviews())
      //       Later on in the writeup, also render the active question 
      //       (to update it) with renderactive()
      //       We can insert our new question into the list and update
      //       our list with new questions that other users submit
      $.ajax({
        url: '/api/getQuestions',
        success: function (res) {
          //set the data variable equal to the response 
          //(this is so we can keep track of the questions and use them in other methods to do things to the questions)
          data = res;
          renderPreviews();
          renderActive();
        }
      })
    }
  
    // makes a list  of questions which all have the question text and a data-qid attribute
    // that allows you to access their _id by doing $whateverjQueryObjectYouHave.data('qid')
    function renderPreviews() {
      $('#questions').html(
          data.map((i) => '<li data-qid="' + i._id + '">' + i.questionText + '</li>').join('')
      )
    }


    // Inserts question's info into right pane of website
    // This method relies on two variables activeIdx and data. 
    // Data is set on every API call to /api/getQuestions
    // Let's say we click on a question. The ideal flow is that 
    // we get the id of that question and then figure out where 
    // in our array of data that question lies and we just would 
    // normally store the value at that array index. However, 
    // since we are dealing with data that changes, it is very 
    // possible that our question could change while we are looking 
    // at it. By storing only the index of the active question and 
    // getting the question information from our data array each 
    // time we call renderActive(), we can ensure that the new 
    // data of the question will actually render out.
    function renderActive() {
      if (activeIdx > -1) {
        var active = data[activeIdx];
        $('#show-question').css('display', 'block');
        $('#question').text(active.questionText ? active.questionText: '');
        $('#author').text(active.author ? active.author: '');
        $('#answer-text').text(active.answer ? active.answer : '');
      } else {
        $('#show-question').css('display', 'none');
      }
    }
  
    $('#questions').on('click', 'li', function () {
      var _id = $(this).data('qid');
      //       When a question is clicked, set the `active` variable equal to
      //       the data of the question that is active (hint: look through the 
      //       data array. If an array entry has the same _id as the _id we just
      //       declared here, it is the active question
      data.forEach(function(element, index) {
        if (_id == element._id) {
          activeIdx = index;
        }
      })
      
      // we now render out the active question
      renderActive();
    })
  
    $('#show-question').on('click', '#submitAnswer', function () {
      var answer = $('#answer').val();
      var _id = data[activeIdx]._id;
      //      When we submit a new answer, send a POST request to
      //      /api/answerQuestion with the question answer and the active question's
      //      _id.
      $.ajax({
        url: '/api/answerQuestion',
        data: { answer: answer, qid: _id },
        type: 'POST',
        success: function(res) {
          console.log(res);
        }
      })
    })
  
    // when we want to make a new question, show the modal
    $('#new-question').on('click', function () {
      $('.modal').css('display', 'block');
    })
  
  
    $('#close-modal').on('click', function () {
      $('.modal').css('display', 'none');
    })
  
  
    $('#submit-question').on('click', function () {
      var qText = $('#question-text').val();
      // AJAX post request to /api/addQuestion with the qText as the 
      // questionText attribute. On success, hide the modal
      // This function basically says, when we click on the submit button 
      // function, grab the text from the textbox and store it in qText. 
      // We implement the AJAX post logic to our server's API route for handling 
      // adding a new question. That's the /api/addQuestion route. To make an 
      // ajax post request, we specify url, type, data, and success properties of 
      // the object passed into the $.ajax(...) function.
      $.ajax({
        url: '/api/addQuestion',
        data: { questionText: qText },
        type: 'POST',
        success: function(res) {
          console.log(res);
          $('.modal').css('display', 'none'); //Close modal. todo right? or $('#close-modal').on('click', function () {$('.modal').css('display', 'none');})
        }
      })
    })
  })