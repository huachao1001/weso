class CodeEditor {
    constructor(options) {
        this.container = options.container;
        this.language = options.language || 'javascript';
        this.code = options.code || '';
        this.onChange = options.onChange || function() {};

        this._initEditor();
    }

    _initEditor() {
        this.container.style.height = '100%';
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';

        this.cm = CodeMirror(this.container, {
            value: this.code,
            mode: this.language,
            theme: 'vscode-light',
            lineNumbers: true,
            matchBrackets: true,
            autoCloseBrackets: true,
            indentUnit: 4,
            tabSize: 4,
            indentWithTabs: false,
            lineWrapping: true,
            styleActiveLine: true,
            viewportMargin: Infinity
        });

        this.cm.getWrapperElement().style.height = '100%';
        this.cm.getScrollerElement().style.height = '100%';

        this.cm.on('change', () => {
            this.onChange(this.cm.getValue());
        });
    }

    getValue() {
        return this.cm.getValue();
    }

    setValue(code) {
        this.cm.setValue(code);
    }
}