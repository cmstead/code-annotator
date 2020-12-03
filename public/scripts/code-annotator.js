(function () {
    const sourceName = 'test';
    const sourceContainer = $('#source-lines');

    $.get(`/source/${sourceName}`)
        .then(function (sourceLines) {
            sourceLines.forEach(insertLine);
        });

    function insertLine(line, index) {
        const newLine = $(`<div data-content=""><pre><code data-line="${index + 1}">${line}</code></pre></div>`);
        $('#source-lines').append(newLine);
    }

    function getSourceIndent(element) {
        const sourceLine = $(element).find('code').text()
        return sourceLine.replace(/^(\s*)[^\s].*/, '$1').length;
    }

    function addComment(element, content) {
        if (content.trim() !== '') {
            const sourceIndent = getSourceIndent(element);

            const comment = $(`<div class="comment" style="margin-left: ${sourceIndent * 0.7}em;">${content}</div>`);
            $(element).prepend(comment);

            comment.on('click', function () {
                addCommentInput(element);
            });
        }
    }

    function stripComment(element) {
        $(element).find('.comment').remove();
    }

    function resetComment(element) {
        $(element).find('.comment-input-wrapper').remove();
        addComment(element, $(element).data('content'));
    }

    function addCommentInput(element) {
        stripComment(element);

        const currentComment = $(element).data('content');
        const sourceIndent = getSourceIndent(element);
        const commentInput = $(`<div class="comment comment-input-wrapper" style="margin-left: ${sourceIndent * 0.7}em;"><input type="text" value="${currentComment}" class="comment-input"></div>`);
        const commentInputField = commentInput.find('input');

        $(element).prepend(commentInput);


        $(commentInputField).on('keyup', function (event) {
            if (event.key.toLowerCase() === 'escape') {
                resetComment(element);
            } else if (event.key.toLowerCase() === 'enter') {
                const comment = commentInputField.val();
                $(element).data('content', comment);
                addComment(element, comment);

                commentInputField.val('');
                commentInput.remove();
            }
            // console.log(event.key);
        });

        $(commentInputField).on('blur', function () {
            resetComment(element);
        })

        commentInputField.focus();
    }

    sourceContainer.on('click', 'code', function (event) {
        const containerDiv = $(event.target).parent().parent();

        addCommentInput(containerDiv);
    });

    sourceContainer.on('mouseover', 'code', function (event) {
        $(event.target).parent().addClass('hover');
    });

    sourceContainer.on('mouseout', 'code', function (event) {
        $(event.target).parent().removeClass('hover');
    });

})();