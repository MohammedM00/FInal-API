let catalogData = [];
let searchData = [];
let currentSelected, currentSelectedIndex;

            const setup = () => {
                $("#bookSearchButton").on("click", function () {
                    let bookInfo = getInformation();
                });

                // Create a book on button click
                $("#createEntry").on("click", function () { // New array of currently entered values
                    let newEntry = {
                        title: $("#bookTitle").val(),
                        subject: $("#relatedSubject").val(),
                        author: $("#authorName").val(),
                        isbn: $("#isbnNum").val()
                    };
                    // Push new entry array to global catalogData variable
                    catalogData.push(newEntry);
                    console.log(catalogData);
                    let entryBookName = `<option>${
                        newEntry.title
                    }</option>`;
                    $("#bookList").append(entryBookName);
                    console.log(newEntry);
                });

                // Read current selected book
                $("#readBook").on("click", function () { // Get index of currently selected item
                    console.log(catalogData);
                    $("#bookName").html(`${
                        catalogData[currentSelectedIndex].title
                    }`);
                    $("#author").html(`AUTHOR: ${
                        catalogData[currentSelectedIndex].author
                    }`);
                    $("#isbn").html(`ISBN: ${
                        catalogData[currentSelectedIndex].isbn
                    }`);
                    $("#subject").html(`RELATED SUBJECT: ${
                        catalogData[currentSelectedIndex].subject
                    }`);
                });

                // Function when selecting a book in the book list
                $("#bookList").on("click", function () {
                    currentSelectedIndex = $("select[name='books'] option:selected").index();
                    currentSelected = catalogData[currentSelectedIndex];
                    console.log(currentSelected);
                });

                // Delete selected entry function
                $("#deleteBook").on("click", function () {
                    $("select[name='books'] option:selected").fadeOut(300, function () {
                        $(this).remove();
                    });
                    catalogData.splice(currentSelectedIndex, 1);
                    // Checking if global variable catalogData has been updated
                    console.log(catalogData);
                });

                // Add current search result to catalog list/catalogData array
                $("#addSearch").on("click", function () { // Adding current search result into the catalogData variable
                    catalogData.push({title: searchData[0].title, subject: searchData[0].subject, author: searchData[0].author, isbn: searchData[0].isbn});
                    // Checking if catalogData array is updated
                    console.log(catalogData);

                    // Displaying the newly added book item to the listbox
                    let entryBookName = `<option>${
                        searchData[0].title
                    }</option>`;
                    $("#bookList").append(entryBookName);

                });

                // Update current selected search result
                $("#updateBook").on("click", function () {
                    let updatedTitle = $("#bookTitle").val();
                    catalogData[currentSelectedIndex].title = $("#bookTitle").val();
                    catalogData[currentSelectedIndex].author = $("#authorName").val();
                    catalogData[currentSelectedIndex].isbn = $("#isbnNum").val();
                    catalogData[currentSelectedIndex].subject = $("#relatedSubject").val();

                    // Checking that array reflects update changes
                    console.log(catalogData);
                    $(`#bookList option:selected`).text(updatedTitle);

                    

                });

            }

            // AJAX GET request
            const getInformation = () => {
                let bookName = $("#bookSearchName").val();
                $.ajax({
                    type: "GET",
                    url: "https://openlibrary.org/search.json?title=" + bookName,
                    dataType: "json",
                    success: function (result, status, xhr) {
                        process(result);
                    },
                    error: function (xhr, status, error) {
                        alert("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText);
                    }
                });
            };

            const successfullyExecutedAPI = (data) => {
                console.log("successAPI ", data);
                let markup = process(data);
                $("#bookDisplay").html(markup);
            };

            // Process data from library API
            const process = (data) => { // Resetting search variable after each search
                searchData = [];

                // Initializing new array from data variable
                let bookSearchData = {
                    title: data.docs[0].title_suggest,
                    author: data.docs[0].author_name[0],
                    subject: data.docs[0].subject[0],
                    isbn: data.docs[0].isbn[0]
                };

                searchData.push(bookSearchData);

                console.log(searchData);

                // After search, data from API is loaded to the webpage
                $("#bookName").html(bookSearchData.title);
                $("#author").html(`AUTHOR: ${
                    bookSearchData.author
                }`);
                $("#isbn").html(`ISBN: ${
                    bookSearchData.isbn
                }`);
                $("#subject").html(`RELATED SUBJECT: ${
                    bookSearchData.subject
                }`);
            }


            $(document).ready(setup);
