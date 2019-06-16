export const uploadToCloudinary = (cb) => {
  if (!cloudinary && !window.cloudinary) {
    cb({
      type: 'App_error',
      status: 400,
      message: 'Uploader Library not loaded'
    }, null);
    return;
  }
  if (!cloudinary.createUploadWidget) {
    cb({
      type: 'App_error',
      status: 400,
      message: 'Uploading misconfigured'
    }, null)
    return;
  }
  const uploadWidget = cloudinary.createUploadWidget({
    cloudName: 'keen-pages',
    sources: ['local'],
    multiple: false,
    // cropping: true,
    // croppingAspectRatio: 1,
    // croppingShowBackButton: true,
    resourceType: 'image',
    uploadPreset: 'fjkxg1yr',
    theme: 'minimal'
  }, cb);

  uploadWidget.open();
}
