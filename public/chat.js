var chatApp = {
    el: {},
    data: {},
    handlers: {},
    init() {
        let _this = this;
        _this.handlers.socket = io({
            // transports: ['websocket'],
            // upgrade: false
        }).connect('http://192.168.43.10:5000');

        _this.setElements();
        _this.registerEventListeners();
        _this.registerSocketEvents();
    },
    setElements() {
        let _this = this;
        _this.el.chat = $('#chat');
        _this.el.chat_title = _this.el.chat.find('.card-header>h5');
        _this.el.output_message = _this.el.chat.find('.output-message');
        _this.el.status = _this.el.chat.find('.status');
        _this.el.user_name = $('#user-name');
        _this.el.message = $('#user-message');
        _this.el.status = _this.el.output_message.find('.status');
        _this.el.chat_form = $('#chat-form');
    },
    registerEventListeners() {
        let _this = this;
        _this.el.user_name.change(() => {
            _this.data.username = _this.el.user_name.val();
            _this.el.chat_title.html(`Welcome, ${_this.data.username}`);
        });

        _this.el.message.keypress(() => {
            _this.handlers.socket.emit('typing', {
                user: _this.data.username
            });
        });

        _this.el.chat_form.submit((e) => {
            e.preventDefault();

            _this.handlers.socket.emit('chat', {
                user: _this.data.username,
                message: _this.el.message.val()
            });
            _this.el.message.val('');
        });

        _this.el.message.blur(() => {
            _this.handlers.socket.emit('not_typing', {
                user: _this.data.username
            });
        })
    },
    registerSocketEvents() {
        let _this = this;

        let chatt = {
            cls: '',
            user_label: '',
            author: {}
        };

        _this.handlers.socket.on('chat', (data) => {
            if (cls = data.id === _this.handlers.socket.id) {
                chatt = {
                    cls: 'success border-right-0 float-right rounded-left',
                    user_label: 'You',
                    author: {
                        cls: 'bg-success float-right ml-1'
                    },
                    message: {
                        cls: 'float-left'
                    }
                };
            } else {
                chatt = {
                    cls: 'danger border-left-0 float-left rounded-right ',
                    user_label: data.user,
                    author: {
                        cls: 'bg-danger float-left mr-1'
                    },
                    message: {
                        cls: 'float-right'
                    }
                };
            }

            _this.el.status.html('');
            _this.el.output_message.append(
                `<div class="col-md-12 mb-1">
                    <div class="border border-${chatt.cls} mw-85 w-auto">
                        <span class="p-1 text-light author ${chatt.author.cls}">${chatt.user_label}</span> 
                        <span class="p-1 ${chatt.message.cls}">${data.message}</span>
                    </div>
                </div>`
            );
        });

        _this.handlers.socket.on('typing', data => {
            _this.el.status.html(
                `<em>${data.user} is typing message...</em>`
            );
        });

        _this.handlers.socket.on('not_typing', data => {
            _this.el.status.clear();
        });
    }
};

chatApp.init();