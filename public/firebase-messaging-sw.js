importScripts('https://www.gstatic.com/firebasejs/7.5.0/firebase-app.js'); // eslint-disable-line
importScripts('https://www.gstatic.com/firebasejs/7.5.0/firebase-messaging.js'); // eslint-disable-line

firebase.initializeApp({
	apiKey: "AIzaSyD_CPmcCwXfAegE08_kCpIbQlCeRDviuOE",
	authDomain: "blog.wearelua.com",
	databaseURL: "https://luadevstudio-blog.firebaseio.com",
	projectId: "luadevstudio-blog",
	storageBucket: "luadevstudio-blog.appspot.com",
	messagingSenderId: "739614403069",
	appId: "1:739614403069:web:25ffb0ff7a606a8a33d194",
	measurementId: "G-MBF97NVXMB"
});

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function (payload) {
	console.log('[firebase-messaging-sw.js] Received background message ', payload);

	const title = payload.data.title;
	const notificationTitle = `${title.charAt(0).toUpperCase()}${title.substr(1)}`;
	const notificationOptions = {
		body: payload.data.message,
		icon: '/images/general/logo.png',
		badge: '/images/general/badge.png',
		data: {
			url: payload.data.url
		},
		actions: payload.data.url === "noPost" ? undefined : [
			{
				action: 'seePost',
				title: "Ver post",
				icon: "/images/general/eye.png"
			}
		],
		vibrate: [200, 200, 200]
	};

	return self.registration.showNotification(notificationTitle,
		notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
	event.notification.close();
	if (event.notification.data.url !== "noPost") clients.openWindow(`/posts/${event.notification.data.url}`);
	else clients.openWindow('/');
})
