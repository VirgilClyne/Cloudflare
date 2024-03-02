import $Storage from '../ENV/$Storage.mjs'

/**
 * Set Caches
 * @author VirgilClyne
 * @param {String} name - Persistent Store Key
 * @param {String} platform - Platform Name
 * @param {String} url - Request URL
 * @param {Object} headers - Request Headers
 * @return {Boolean}
 */
export default function setCaches(name, platform, url, headers) {
	// 转存必要值
	const newCaches = {
		"url": url,
		"headers": headers
	};
	// 写入Caches
	return $Storage.getItem(`@${name}.${platform}.Caches`, newCaches);
};
