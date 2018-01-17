from utils import log
from routes import json_response, current_user
from models.comment import Comment


# 本文件只返回 json 格式的数据
# 而不是 html 格式的数据
def all(request):
    comments = Comment.all_json()
    return json_response(comments)


def add(request):
    # 得到浏览器发送的表单, 浏览器用 ajax 发送 json 格式的数据过来
    # 所以这里我们用新增加的 json 函数来获取格式化后的 json 数据
    form = request.json()
    u = current_user(request)
    user_id = int(u.id)
    # 创建一个 comment
    t = Comment.new(form, user_id)
    # 把创建好的 comment 返回给浏览器
    return json_response(t.json())


def delete(request):
    comment_id = int(request.query.get('id'))
    t = Comment.delete(comment_id)
    return json_response(t.json())


def update(request):
    form = request.json()
    log('api comment update', form)
    comment_id = int(form.get('id'))
    t = Comment.update(comment_id, form)
    return json_response(t.json())


def route_dict():
    d = {
        '/api/comment/all': all,
        '/api/comment/add': add,
        '/api/comment/delete': delete,
        '/api/comment/update': update,
    }
    return d
