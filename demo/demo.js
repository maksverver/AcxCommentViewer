'use strict';

const fileInput = document.getElementById('file-input');;
const rootDiv = document.getElementById('ext-comments');
let comments = undefined;

function isCommentApiEnabled() {
  return document.getElementById('comment-api-enabled').checked;
}

const longerDateFormat = new Intl.DateTimeFormat('en-US', {
  month: 'long', day: 'numeric',
  hour: '2-digit', minute: '2-digit'});

let replaceCommentOptions = {
  ...REPLACE_COMMENTS_DEFAULT_OPTIONS,
  dateFormatShort: longerDateFormat,
  commentOrder: CommentOrder.CHRONOLOGICAL,
  commentApi: {
    async createComment(parentId, body) {
      if (!isCommentApiEnabled()) {
        throw new Error("Can't create comment. Comment API is disabled.");
      }
      return {
        "id": Math.round(Math.random()*1e9),
        "user_id": replaceCommentOptions.userId,
        "name": "User",
        "date": new Date().toISOString(),
        "body": body,
        "children": [],
      };
    },

    async editComment(id, body) {
      if (!isCommentApiEnabled()) {
        throw new Error("Can't edit comment. Comment API is disabled.");
      }
      return {id, body};
    },

    async deleteComment(id) {
      if (!isCommentApiEnabled()) {
        throw new Error("Can't delete comment. Comment API is disabled.");
      }
      return {};
    },
  }
};

function repopulate() {
  if (!comments) return;
  replaceComments(rootDiv, comments, replaceCommentOptions);
  runOptionsOnLoad();
}

function handleFileChange() {
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      comments = JSON.parse(reader.result).comments;
      repopulate();
    };
    reader.readAsText(file);
  }
}

function setDateFormat(value) {
  replaceCommentOptions.dateFormatShort =
      value === 'longer'
          ? longerDateFormat
          : REPLACE_COMMENTS_DEFAULT_OPTIONS.dateFormatShort;
  repopulate();
}

function setCommentOrder(value) {
  replaceCommentOptions.commentOrder =
      value === 'most_recent_first' ? CommentOrder.NEW_FIRST : CommentOrder.CHRONOLOGICAL;
  repopulate();
}

function setUserId(value) {
  replaceCommentOptions.userId = value;
  repopulate();
}

async function initializeDemo() {
  await startOptions();
}

initializeDemo();
