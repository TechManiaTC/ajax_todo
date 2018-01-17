// COMMENT API
// 获取所有 comment
var apiCommentAll = function(callback) {
    var path = '/api/comment/all'
    ajax('GET', path, '', callback)
}

// 增加一个 comment
var apiCommentAdd = function(form, callback) {
    var path = '/api/comment/add'
    ajax('POST', path, form, callback)
}

var apiCommentDelete = function(id, callback) {
    var path = `/api/comment/delete?id=${id}`
    ajax('GET', path, '', callback)
}

var apiCommentUpdate = function(form, callback) {
    var path = '/api/comment/update'
    ajax('POST', path, form, callback)
}

var commentTemplate = function(comment) {
// COMMENT DOM
    var t = `
        <div class="comment-cell">
            <button data-id=${comment.id} class="comment-delete">删除</button>
            <button data-id=${comment.id} class="comment-edit">编辑</button>
            <span style="color:red" class="comment-content">${comment.content}</span>
        </div>
    `
    return t
}

var commentAddTemplate = function(commentId) {
// COMMENT DOM
    var t = `
        <div class="comment-add-form">
            <input class="comment-add-input">
            <button data-id=${commentId} class="comment-add-confirm">发表评论</button>
        </div>
    `
    return t
}

var commentUpdateTemplate = function(commentId) {
// COMMENT DOM
    var t = `
        <div class="comment-update-form">
            <input class="comment-update-input">
            <button data-id=${commentId} class="comment-update">更新评论</button>
        </div>
    `
    return t
}


var insertComment = function(comment) {
    var commentCell = commentTemplate(comment)
    var weiboId = comment.weibo_id
    // 插入 comment-list
    var commentList = e(`#weibo${weiboId}`)
    commentList.insertAdjacentHTML('beforeend', commentCell)
}

var insertCommentAdd = function(edit_button) {
    var commentId = edit_button.dataset.id
    var editCell = commentAddTemplate(commentId)
    edit_button.parentElement.insertAdjacentHTML('beforeend', editCell)
}

var insertCommentUpdate = function(edit_button) {
    var commentId = edit_button.dataset.id
    var editCell = commentUpdateTemplate(commentId)
    edit_button.parentElement.insertAdjacentHTML('beforeend', editCell)
}

var loadComments = function() {
    // 调用 ajax api 来载入数据
    // comments = api_comment_all()
    // process_comments(comments)
    apiCommentAll(function(r) {
        // console.log('load all', r)
        // 解析为 数组
        var comments = JSON.parse(r)
        // 循环添加到页面中
        for(var i = 0; i < comments.length; i++) {
            var comment = comments[i]
            insertComment(comment)
        }
    })
}

var bindEventCommentAdd = function(){
    var commentList = e('.weibo-list')
    commentList.addEventListener('click', function(event){
        var self = event.target
        if (self.classList.contains('comment-add')) {
            log('点到了 评论按钮，id 是', self.dataset.id )
            insertCommentAdd(self)
        } else {
            log('点击的不是编辑按钮******')
        }
    })
}

var bindEventCommentAddConfirm = function(){
    var commentList = e('.weibo-list')
    commentList.addEventListener('click', function(event){
        var self = event.target
        if (self.classList.contains('comment-add-confirm')) {
            log('点到了 评论按钮，id 是', self.dataset.id )

            var commentCell = self.closest('.comment-add-form')
            var input = commentCell.querySelector('.comment-add-input')
            var weiboId = self.dataset.id
            var form = {
                weibo_id: weiboId,
                content: input.value,
            }

            apiCommentAdd(form, function(r){
                log('收到新评论数据', r)
                // var addForm = commentCell.querySelector('.comment-add-form')
                commentCell.remove()
                var comment = JSON.parse(r)
                var newComment = commentTemplate(comment)
                var weiboId = self.dataset.id
                var commentTask = e(`#weibo${weiboId}`)
                commentTask.insertAdjacentHTML('beforeend', newComment)
            })
        } else {
            log('点击的不是更新按钮******')
        }
    })
}

var bindEventCommentDelete = function() {
    var commentList = e('.weibo-list')
    commentList.addEventListener('click', function(event){
        var self = event.target
        if (self.classList.contains('comment-delete')) {
            log('点到了 删除按钮，id 是', self.dataset.id )
            var commentId = self.dataset.id
            apiCommentDelete(commentId, function(r) {
                self.parentElement.remove()
            })
        } else {
            log('点击的不是删除按钮******')
        }
    })
}

var bindEventCommentEdit = function(){
    var commentList = e('.weibo-list')
    commentList.addEventListener('click', function(event){
        var self = event.target
        if (self.classList.contains('comment-edit')) {
            log('点到了 编辑按钮，id 是', self.dataset.id )
            insertCommentUpdate(self)
        } else {
            log('点击的不是编辑按钮******')
        }
    })
}

var bindEventCommentUpdate = function(){
    var commentList = e('.weibo-list')
    commentList.addEventListener('click', function(event){
        var self = event.target
        if (self.classList.contains('comment-update')) {
            log('点到了 更新按钮，id 是', self.dataset.id )
            var commentCell = self.closest('.comment-cell')
            // var commentCell = self.closest('.comment-update-form')
            var input = commentCell.querySelector('.comment-update-input')
            var commentId = self.dataset.id
            var form = {
                id: commentId,
                content: input.value,
            }

            apiCommentUpdate(form, function(r){
                log('收到更新后的评论数据', r)

                var updateForm = commentCell.querySelector('.comment-update-form')
                updateForm.remove()

                var comment = JSON.parse(r)
                var commentTask = commentCell.querySelector('.comment-content')
                log('commenttask', commentTask)
                commentTask.innerText = comment.content
            })
        } else {
            log('点击的不是更新按钮******')
        }
    })
}

var bindEvents = function() {
    bindEventCommentAdd()
    bindEventCommentAddConfirm()
    bindEventCommentDelete()
    bindEventCommentEdit()
    bindEventCommentUpdate()
}

var __main = function() {
    bindEvents()
    loadComments()
}

__main()
