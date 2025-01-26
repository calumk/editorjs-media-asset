import { IconPicture } from '@codexteam/icons';
import { make } from './utils/dom';

/**
 * Class for working with UI:
 *  - rendering base structure
 *  - show/hide preview
 *  - apply tune view
 */
export default class Ui {
  /**
   * @param {object} ui - media tool Ui module
   * @param {object} ui.api - Editor.js API
   * @param {MediaConfig} ui.config - user config
   * @param {Function} ui.onSelectFile - callback for clicks on Select file button
   * @param {boolean} ui.readOnly - read-only mode flag
   */
  constructor({ api, config, onSelectFile, readOnly }) {
    this.api = api;
    this.config = config;
    this.onSelectFile = onSelectFile;
    this.readOnly = readOnly;
    this.nodes = {
      wrapper: make('div', [this.CSS.baseClass, this.CSS.wrapper]),
      mediaContainer: make('div', [ this.CSS.mediaContainer ]),
      fileButton: this.createFileButton(),
      mediaEl: undefined,
      mediaPreloader: make('div', this.CSS.mediaPreloader),
      caption: make('div', [this.CSS.input, this.CSS.caption], {
        contentEditable: !this.readOnly,
      }),
    };

    /**
     * Create base structure
     *  <wrapper>
     *    <media-container>
     *      <media-preloader />
     *    </media-container>
     *    <caption />
     *    <select-file-button />
     *  </wrapper>
     */
    this.nodes.caption.dataset.placeholder = this.config.captionPlaceholder;
    this.nodes.mediaContainer.appendChild(this.nodes.mediaPreloader);
    this.nodes.wrapper.appendChild(this.nodes.mediaContainer);
    this.nodes.wrapper.appendChild(this.nodes.caption);
    this.nodes.wrapper.appendChild(this.nodes.fileButton);
  }

  /**
   * CSS classes
   *
   * @returns {object}
   */
  get CSS() {
    return {
      baseClass: this.api.styles.block,
      loading: this.api.styles.loader,
      input: this.api.styles.input,
      button: this.api.styles.button,

      /**
       * Tool's classes
       */
      wrapper: 'media-tool',
      mediaContainer: 'media-tool__media',
      mediaPreloader: 'media-tool__media-preloader',
      mediaEl: 'media-tool__media-picture',
      caption: 'media-tool__caption',
    };
  };

  /**
   * Ui statuses:
   * - empty
   * - uploading
   * - filled
   *
   * @returns {{EMPTY: string, UPLOADING: string, FILLED: string}}
   */
  static get status() {
    return {
      EMPTY: 'empty',
      UPLOADING: 'loading',
      FILLED: 'filled',
      FAILED: 'failed'
    };
  }

  /**
   * Renders tool UI
   *
   * @param {MediaToolData} toolData - saved tool data
   * @returns {Element}
   */
  render(toolData) {
    // console.log("RENDER", toolData) 
    if (!toolData.file || Object.keys(toolData.file).length === 0) {
      // console.log("EMPTY")
      this.toggleStatus(Ui.status.EMPTY);
    } else {
      // console.log("UPLOADING")
      this.toggleStatus(Ui.status.UPLOADING);
    }

    return this.nodes.wrapper;
  }

  /**
   * Creates upload-file button
   *
   * @returns {Element}
   */
  createFileButton() {
    const button = make('div', [ this.CSS.button ]);

    button.innerHTML = this.config.buttonContent || `${IconPicture} ${this.api.i18n.t('Upload File')}`;

    button.addEventListener('click', () => {
      this.onSelectFile();
    });

    return button;
  }


   /**
   * Creates upload-file button
   *
   * @returns {Element}
   */
   createDownloadFileButton(src) {
    const button = make('div', ['ck-download-button']);
    button.innerHTML = this.config.buttonContent || `${this.api.i18n.t('Download:')} ${src.split('/').pop()}`;
    button.addEventListener('click', () => {
      // download the file
      window.open(src, '_blank');
    });

    return button;
  }



  /**
   * Shows uploading preloader
   *
   * @param {string} src - preview source
   * @returns {void}
   */
  showPreloader(src) {
    this.nodes.mediaPreloader.style.backgroundImage = `url(${src})`;

    this.toggleStatus(Ui.status.UPLOADING);
  }

  /**
   * Hide uploading preloader
   *
   * @returns {void}
   */
  hidePreloader() {
    this.nodes.mediaPreloader.style.backgroundImage = '';
    this.toggleStatus(Ui.status.EMPTY);
  }

  /**
   * Shows a medium
   *
   * @param {string} url - medium source
   * @returns {void}
   */
  fillMedia(url) {
    /**
     * Check for a source extension to compose element correctly: video tag for mp4, img — for others
     */

    // let tag;
    // if (url.endsWith(".mp4")) {
    //   tag = "VIDEO";
    // } else if (url.endsWith(".mp3")) {
    //   tag = "AUDIO";
    // } else {
    //   tag = "IMG";
    // }
    
    // check for common video extensions for html5 video tag (mp4, webm, ogg)
    // check for common audio extensions for html5 audio tag (mp3, ogg, wav)
    // check for common document extension : limit to : (pdf, doc, docx, xls, xlsx, ppt, pptx, zip, rar, 7z)
    // check for common image extensions for html5 img tag (jpg, jpeg, png, gif, svg)


    // console.log(url);
    let tag;
    if (url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".ogg")) {
      tag = "VIDEO";
    } else if (url.endsWith(".mp3") || url.endsWith(".ogg") || url.endsWith(".wav")) {
      tag = "AUDIO";
    } else if (url.endsWith(".pdf") || url.endsWith(".doc") || url.endsWith(".docx") || url.endsWith(".xls") || url.endsWith(".xlsx") || url.endsWith(".ppt") || url.endsWith(".pptx") || url.endsWith(".zip") || url.endsWith(".rar") || url.endsWith(".7z")) {
      tag = "DOWNLOAD";
    } else if (url.endsWith(".jpg") || url.endsWith(".jpeg") || url.endsWith(".png") || url.endsWith(".gif") || url.endsWith(".svg")) {
      tag = "IMG";
    } else {
      throw new Error("Unsupported file format");
    }



    const attributes = {
      src: url,
    };

    /**
     * We use eventName variable because IMG and VIDEO tags have different event to be called on source load
     * - IMG: load
     * - VIDEO: loadeddata
     *
     * @type {string}
     */
    let eventName = 'load';

    /**
     * Update attributes and eventName if source is a mp4 video
     */
    if (tag === 'VIDEO' || tag === 'AUDIO') {
      /**
       * Add attributes for playing muted mp4 as a gif
       *
       * @type {boolean}
       */
      attributes.muted = true;
      attributes.playsinline = true;
      attributes.controls = true;

      if (tag === 'AUDIO') {
        attributes.style = "width: 100%;"
      }

      /**
       * Change event to be listened
       *
       * @type {string}
       */
      eventName = 'loadeddata';
    }


  

    /**
     * Compose tag with defined attributes
     *
     * @type {Element}
     */

    if (tag === 'DOWNLOAD') {
      eventName = 'divLoaded';
      this.nodes.mediaEl = this.createDownloadFileButton(url);
    }else{
      this.nodes.mediaEl = make(tag, this.CSS.mediaEl, attributes);
    }

    /**
     * Add load event listener
     */

    let eventFired = false;

    this.nodes.mediaEl.addEventListener(eventName, () => {
      // console.log("Fires2025", eventName)
      // console.log(Ui.status)
      eventFired = true;
      
      requestAnimationFrame(() => {
        this.toggleStatus(Ui.status.FILLED);
      });

      // this.toggleStatus(Ui.status.UPLOADING);
      /**
       * Preloader does not exists on first rendering with presaved data
       */
      if (this.nodes.mediaPreloader) {
        this.nodes.mediaPreloader.style.backgroundImage = '';
      }
    });
  

    this.nodes.mediaContainer.innerHTML = '';
    this.nodes.mediaContainer.appendChild(this.nodes.mediaEl);

    if (tag == 'DOWNLOAD') {
      const _event = new Event('divLoaded');
      this.nodes.mediaEl.dispatchEvent(_event);
    }

    setTimeout(() => {
      if (!eventFired) {
        this.toggleStatus(Ui.status.FAILED);
      }
    },4000);

  }

  /**
   * Shows caption input
   *
   * @param {string} text - caption text
   * @returns {void}
   */
  fillCaption(text) {
    if (this.nodes.caption) {
      this.nodes.caption.innerHTML = text;
    }
  }

  /**
   * Changes UI status
   *
   * @param {string} status - see {@link Ui.status} constants
   * @returns {void}
   */
  toggleStatus(status) {
    // console.log("AAA")

    for (const statusType in Ui.status) {
      if (Object.prototype.hasOwnProperty.call(Ui.status, statusType)) {
        this.nodes.wrapper.classList.toggle(`${this.CSS.wrapper}--${Ui.status[statusType]}`, status === Ui.status[statusType]);
        // console.log(`${this.CSS.wrapper}--${Ui.status[statusType]}`, status === Ui.status[statusType]);
      }
    }

    if (status === Ui.status.FAILED) {
      console.log(this)
      this.nodes.mediaContainer.innerHTML = `<div class="ck-media-error"><b>Error loading Asset</b> <br> <span class="url">${this.nodes.mediaEl.src} </span></div>`;
    }
  }

  /**
   * Apply visual representation of activated tune
   *
   * @param {string} tuneName - one of available tunes {@link Tunes.tunes}
   * @param {boolean} status - true for enable, false for disable
   * @returns {void}
   */
  applyTune(tuneName, status) {
    this.nodes.wrapper.classList.toggle(`${this.CSS.wrapper}--${tuneName}`, status);
  }
}

