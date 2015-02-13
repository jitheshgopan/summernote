define([
  'summernote/core/agent',
  'summernote/core/func',
  'summernote/core/list',
  'summernote/core/dom',
  'summernote/core/range',
  'summernote/core/async',
  'summernote/editing/Style',
  'summernote/editing/Typing',
  'summernote/editing/Table',
  'summernote/editing/Bullet'
], function (agent, func, list, dom, range, async, Style, Typing, Table, Bullet) {
  /**
   * @class editing.Editor
   *
   * Editor
   *
   */
  var Editor = function () {

    var style = new Style();
    var table = new Table();
    var typing = new Typing();
    var bullet = new Bullet();

    /**
     * @method createRange
     *
     * create range
     *
     * @param {jQuery} $editable
     * @return {WrappedRange}
     */
    this.createRange = function ($editable) {
      $editable.focus();
      return range.create();
    };

    /**
     * @method saveRange
     *
     * save current range
     *
     * @param {jQuery} $editable
     * @param {Boolean} [thenCollapse=false]
     */
    this.saveRange = function ($editable, thenCollapse) {
      $editable.focus();
      $editable.data('range', range.create());
      if (thenCollapse) {
        range.create().collapse().select();
      }
    };

    /**
     * @method saveRange
     *
     * save current node list to $editable.data('childNodes')
     *
     * @param {jQuery} $editable
     */
    this.saveNode = function ($editable) {
      // copy child node reference
      var copy = [];
      for (var key  = 0, len = $editable[0].childNodes.length; key < len; key++) {
        copy.push($editable[0].childNodes[key]);
      }
      $editable.data('childNodes', copy);
    };

    /**
     * @method restoreRange
     *
     * restore lately range
     *
     * @param {jQuery} $editable
     */
    this.restoreRange = function ($editable) {
      var rng = $editable.data('range');
      if (rng) {
        rng.select();
        $editable.focus();
      }
    };

    /**
     * @method restoreNode
     *
     * restore lately node list
     *
     * @param {jQuery} $editable
     */
    this.restoreNode = function ($editable) {
      $editable.html('');
      var child = $editable.data('childNodes');
      for (var index = 0, len = child.length; index < len; index++) {
        $editable[0].appendChild(child[index]);
      }
    };
    /**
     * @method currentStyle
     *
     * current style
     *
     * @param {Node} target
     * @return {Boolean} false if range is no
     */
    this.currentStyle = function (target) {
      var rng = range.create();
      return rng ? rng.isOnEditable() && style.current(rng, target) : false;
    };

    var triggerOnBeforeChange = this.triggerOnBeforeChange = function ($editable) {
      var onBeforeChange = $editable.data('callbacks').onBeforeChange;
      if (onBeforeChange) {
        onBeforeChange($editable.html(), $editable);
      }
    };

    var triggerOnChange = this.triggerOnChange = function ($editable) {
      var onChange = $editable.data('callbacks').onChange;
      if (onChange) {
        onChange($editable.html(), $editable);
      }
    };

    /**
     * @method undo
     * undo
     * @param {jQuery} $editable
     */
    this.undo = function ($editable) {
      triggerOnBeforeChange($editable);
      $editable.data('NoteHistory').undo();
      triggerOnChange($editable);
    };

    /**
     * @method redo
     * redo
     * @param {jQuery} $editable
     */
    this.redo = function ($editable) {
      triggerOnBeforeChange($editable);
      $editable.data('NoteHistory').redo();
      triggerOnChange($editable);
    };

    /**
     * @method afterCommand
     * after command
     * @param {Function} exec
     */
    var makeEditingCommand = this.makeEditingCommand = function (exec) {
      var self = this;

      return function () {
        var $editable = list.head(arguments);

        // before editing
        triggerOnBeforeChange($editable);

        // editing
        exec.apply(self, arguments);

        // after editing
        $editable.data('NoteHistory').recordUndo();
        triggerOnChange($editable);
      };
    };

    /**
     * @method bold
     * @param {jQuery} $editable
     * @param {Mixed} value
     */

    /**
     * @method italic
     * @param {jQuery} $editable
     * @param {Mixed} value
     */

    /**
     * @method underline
     * @param {jQuery} $editable
     * @param {Mixed} value
     */

    /**
     * @method strikethrough
     * @param {jQuery} $editable
     * @param {Mixed} value
     */

    /**
     * @method formatBlock
     * @param {jQuery} $editable
     * @param {Mixed} value
     */

    /**
     * @method superscript
     * @param {jQuery} $editable
     * @param {Mixed} value
     */

    /**
     * @method subscript
     * @param {jQuery} $editable
     * @param {Mixed} value
     */

    /**
     * @method justifyLeft
     * @param {jQuery} $editable
     * @param {Mixed} value
     */

    /**
     * @method justifyCenter
     * @param {jQuery} $editable
     * @param {Mixed} value
     */

    /**
     * @method justifyRight
     * @param {jQuery} $editable
     * @param {Mixed} value
     */

    /**
     * @method justifyFull
     * @param {jQuery} $editable
     * @param {Mixed} value
     */

    /**
     * @method formatBlock
     * @param {jQuery} $editable
     * @param {Mixed} value
     */

    /**
     * @method removeFormat
     * @param {jQuery} $editable
     * @param {Mixed} value
     */

    /**
     * @method backColor
     * @param {jQuery} $editable
     * @param {Mixed} value
     */

    /**
     * @method foreColor
     * @param {jQuery} $editable
     * @param {Mixed} value
     */

    /**
     * @method insertHorizontalRule
     * @param {jQuery} $editable
     * @param {Mixed} value
     */

    /**
     * @method fontName
     * @param {jQuery} $editable
     * @param {Mixed} value
     */

    /* jshint ignore:start */
    // native commands(with execCommand), generate function for execCommand
    var commands = ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript',
                    'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull',
                    'formatBlock', 'removeFormat',
                    'backColor', 'foreColor', 'insertHorizontalRule', 'fontName'];

    for (var idx = 0, len = commands.length; idx < len; idx ++) {
      (function (commandName) {
        this[commandName] = makeEditingCommand(function ($editable, value) {
          document.execCommand(commandName, false, value);
        });
      })(commands[idx]);
    }
    /* jshint ignore:end */

    /**
     * @method tab
     *
     * handle tab key
     *
     * @param {jQuery} $editable
     * @param {Object} options
     */
    this.tab = function ($editable, options) {
      var rng = range.create();
      if (rng.isCollapsed() && rng.isOnCell()) {
        table.tab(rng);
      } else {
        this.insertTab($editable, options);
      }
    };

    this.insertTab = makeEditingCommand(function ($editable, options) {
      var rng = range.create();
      typing.insertTab($editable, rng, options.tabsize);
    });

    /**
     * @method untab
     *
     * handle shift+tab key
     *
     */
    this.untab = function () {
      var rng = range.create();
      if (rng.isCollapsed() && rng.isOnCell()) {
        table.tab(rng, true);
      }
    };

    /**
     * @method insertParagraph
     *
     * insert paragraph
     *
     * @param {Node} $editable
     */
    this.insertParagraph = makeEditingCommand(function ($editable) {
      typing.insertParagraph($editable);
    });

    /**
     * @method insertOrderedList
     *
     * @param {jQuery} $editable
     */
    this.insertOrderedList = makeEditingCommand(function ($editable) {
      bullet.insertOrderedList($editable);
    });

    /**
     * @param {jQuery} $editable
     */
    this.insertUnorderedList = makeEditingCommand(function ($editable) {
      bullet.insertUnorderedList($editable);
    });

    /**
     * @param {jQuery} $editable
     */
    this.indent = makeEditingCommand(function ($editable) {
      bullet.indent($editable);
    });

    /**
     * @param {jQuery} $editable
     */
    this.outdent = makeEditingCommand(function ($editable) {
      bullet.outdent($editable);
    });

    /**
     * insert image
     *
     * @param {jQuery} $editable
     * @param {String} sUrl
     */
    this.insertImage = makeEditingCommand(function ($editable, sUrl, filename) {
      async.createImage(sUrl, filename).then(function ($image) {
        $image.css({
          display: '',
          width: Math.min($editable.width(), $image.width())
        });
        range.create().insertNode($image[0]);
        range.createFromNode($image[0]).collapse().select();
      }).fail(function () {
        var callbacks = $editable.data('callbacks');
        if (callbacks.onImageUploadError) {
          callbacks.onImageUploadError();
        }
      });
    });

    /**
     * @method insertNode
     * insert node
     * @param {Node} $editable
     * @param {Node} node
     */
    this.insertNode = makeEditingCommand(function ($editable, node) {
      var rng = this.createRange($editable);
      rng.insertNode(node);
      range.createFromNode(node).collapse().select();
    });

    /**
     * insert text
     * @param {Node} $editable
     * @param {String} text
     */
    this.insertText = makeEditingCommand(function ($editable, text) {
      var rng = this.createRange($editable);
      var textNode = rng.insertNode(dom.createText(text));
      range.create(textNode, dom.nodeLength(textNode)).select();
    });

    /**
     * formatBlock
     *
     * @param {jQuery} $editable
     * @param {String} tagName
     */
    this.formatBlock = makeEditingCommand(function ($editable, tagName) {
      tagName = agent.isMSIE ? '<' + tagName + '>' : tagName;
      document.execCommand('FormatBlock', false, tagName);
    });

    this.formatPara = function ($editable) {
      this.formatBlock($editable, 'P');
    };

    /* jshint ignore:start */
    for (var idx = 1; idx <= 6; idx ++) {
      this['formatH' + idx] = function (idx) {
        return function ($editable) {
          this.formatBlock($editable, 'H' + idx);
        };
      }(idx);
    };
    /* jshint ignore:end */

    /**
     * fontsize
     *
     * @param {jQuery} $editable
     * @param {String} value - px
     */
    this.fontSize = makeEditingCommand(function ($editable, value) {
      var rng = this.createRange($editable);
      var spans = style.styleNodes(rng);
      $.each(spans, function (idx, span) {
        $(span).css({
          'font-size': value + 'px'
        });
      });
    });

    /**
     * lineHeight
     *
     * @param {jQuery} $editable
     * @param {String} value
     */
    this.lineHeight = makeEditingCommand(function ($editable, value) {
      style.stylePara(range.create(), {
        lineHeight: value
      });
    });

    /**
     * unlink
     *
     * @type command
     *
     * @param {jQuery} $editable
     */
    this.unlink = makeEditingCommand(function () {
      var rng = range.create();
      if (rng.isOnAnchor()) {
        var anchor = dom.ancestor(rng.sc, dom.isAnchor);
        rng = range.createFromNode(anchor);
        rng.select();

        document.execCommand('unlink');
      }
    });

    /**
     * create link (command)
     *
     * @param {jQuery} $editable
     * @param {Object} linkInfo
     * @param {Object} options
     */
    this.createLink = makeEditingCommand(function ($editable, linkInfo, options) {
      var linkUrl = linkInfo.url;
      var linkText = linkInfo.text;
      var isNewWindow = linkInfo.newWindow;
      var rng = linkInfo.range;
      var isTextChanged = rng.toString() !== linkText;

      if (options.onCreateLink) {
        linkUrl = options.onCreateLink(linkUrl);
      }

      var anchors;
      if (isTextChanged) {
        // Create a new link when text changed.
        var anchor = rng.insertNode($('<A>' + linkText + '</A>')[0]);
        anchors = [anchor];
      } else {
        anchors = style.styleNodes(rng, {
          nodeName: 'A',
          expandClosestSibling: true,
          onlyPartialContains: true
        });
      }

      $.each(anchors, function (idx, anchor) {
        $(anchor).attr({
          href: linkUrl,
          target: isNewWindow ? '_blank' : ''
        });
      });

      range.createFromNodes(anchors).select();
    });

    /**
     * returns link info
     *
     * @return {Object}
     * @return {WrappedRange} return.range
     * @return {String} return.text
     * @return {Boolean} [return.isNewWindow=true]
     * @return {String} [return.url=""]
     */
    this.getLinkInfo = function ($editable) {
      var rng = this.createRange($editable).expand(dom.isAnchor);

      // Get the first anchor on range(for edit).
      var $anchor = $(list.head(rng.nodes(dom.isAnchor)));

      return {
        range: rng,
        text: rng.toString(),
        isNewWindow: $anchor.length ? $anchor.attr('target') === '_blank' : true,
        url: $anchor.length ? $anchor.attr('href') : ''
      };
    };

    /**
     * setting color
     *
     * @param {Node} $editable
     * @param {Object} sObjColor  color code
     * @param {String} sObjColor.foreColor foreground color
     * @param {String} sObjColor.backColor background color
     */
    this.color = makeEditingCommand(function ($editable, sObjColor) {
      var oColor = JSON.parse(sObjColor);
      var foreColor = oColor.foreColor, backColor = oColor.backColor;

      if (foreColor) { document.execCommand('foreColor', false, foreColor); }
      if (backColor) { document.execCommand('backColor', false, backColor); }
    });

    /**
     * insert Table
     *
     * @param {Node} $editable
     * @param {String} sDim dimension of table (ex : "5x5")
     */
    this.insertTable = makeEditingCommand(function ($editable, sDim) {
      var dimension = sDim.split('x');
      var rng = range.create().deleteContents();
      rng.insertNode(table.createTable(dimension[0], dimension[1]));
    });

    /**
     * float me
     *
     * @param {jQuery} $editable
     * @param {String} value
     * @param {jQuery} $target
     */
    this.floatMe = makeEditingCommand(function ($editable, value, $target) {
      $target.css('float', value);
    });

    /**
     * change image shape
     *
     * @param {jQuery} $editable
     * @param {String} value css class
     * @param {Node} $target
     */
    this.imageShape = makeEditingCommand(function ($editable, value, $target) {
      $target.removeClass('img-rounded img-circle img-thumbnail');

      if (value) {
        $target.addClass(value);
      }
    });

    /**
     * resize overlay element
     * @param {jQuery} $editable
     * @param {String} value
     * @param {jQuery} $target - target element
     */
    this.resize = makeEditingCommand(function ($editable, value, $target) {
      $target.css({
        width: value * 100 + '%',
        height: ''
      });
    });

    /**
     * @param {Position} pos
     * @param {jQuery} $target - target element
     * @param {Boolean} [isKeepRatio] - keep ratio
     */
    this.resizeTo = function (pos, $target, isKeepRatio) {
      var imageSize;
      if (isKeepRatio) {
        var newRatio = pos.y / pos.x;
        var ratio = $target.data('ratio');
        imageSize = {
          width: ratio > newRatio ? pos.x : pos.y / ratio,
          height: ratio > newRatio ? pos.x * ratio : pos.y
        };
      } else {
        imageSize = {
          width: pos.x,
          height: pos.y
        };
      }

      $target.css(imageSize);
    };

    /**
     * remove media object(image, video, ...)
     *
     * @param {jQuery} $editable
     * @param {String} value - dummy argument (for keep interface)
     * @param {jQuery} $target - target element
     */
    this.removeMedia = makeEditingCommand(function ($editable, value, $target) {
      $target.detach();

      var callbacks = $editable.data('callbacks');
      if (callbacks && callbacks.onMediaDelete) {
        callbacks.onMediaDelete($target, this, $editable);
      }
    });
  };

  return Editor;
});
