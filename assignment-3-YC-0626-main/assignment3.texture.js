'use strict'

/**
 * The Texture class is used to store texture information and load image data
 */
class Texture {

    /**
     * Create a new texture instance
     * 
     * @param {String} filename Path to the image texture to load
     * @param {WebGL2RenderingContext} gl The webgl2 rendering context
     * @param {Boolean} flip_y Determines if the texture should be flipped by WebGL (see Ch 7)
     */
    constructor(filename, gl, flip_y = true) {
        this.filename = filename 
        this.texture = this.createTexture(gl, flip_y)
    }

    /**
     * Get the GL handle to the texture
     * 
     * @returns {WebGLTexture} WebGL texture instance
     */
    getGlTexture() {
        return this.texture
    }

    /**
     * Loads image data from disk and creates a WebGL texture instance
     * 
     * @param {WebGL2RenderingContext} gl The webgl2 rendering context
     * @param {Boolean} flip_y Determines if the texture should be flipped by WebGL (see Ch 7)
     * @returns {WebGLTexture} WebGL texture instance
     */
    createTexture(gl, flip_y) {
        // Set up texture flipping
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flip_y);

        // Create a new GL texture
        const texture = gl.createTexture();

        // Configure texture properties
        const level = 0;                    // Highest level of detail
        const internal_format = gl.RGBA;    // Internal format as RGBA
        const src_format = gl.RGBA;         // Source format as RGBA
        const src_type = gl.UNSIGNED_BYTE;  // Data type as unsigned byte

        // Create a new image to load image data from disk
        const image = new Image();
        image.onload = () => {
            // Bind the texture and upload the image data
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, level, internal_format, src_format, src_type, image);

            // Generate mipmap from the full-size texture
            gl.generateMipmap(gl.TEXTURE_2D);

            // Set up texture wrapping mode to repeat
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

            // Set up texture filtering
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); // Mipmap with linear filtering
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);              // Linear filtering for magnification

            // Unbind the texture to prevent accidental modification
            gl.bindTexture(gl.TEXTURE_2D, null);
        };

        // Begin loading the image from disk
        image.src = this.filename;

        return texture;
    }
}

export default Texture;
