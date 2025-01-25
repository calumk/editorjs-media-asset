let example_data = {
	blocks: [
		{
			type: "header",
			data: {
				text: "Example : @calumk/editorjs-codecup ",
				level: 3,
			},
		},
		{
			type: "paragraph",
			data: {
				text: "This is an example of using EditorJs, with the @calumk/editorjs-media package",
			},
		},
		{
			type: "media",
			data: {
				file: {
					url: "https://www.tesla.com/tesla_theme/assets/img/_vehicle_redesign/roadster_and_semi/roadster/hero.jpg"
				},
				caption: "Roadster // tesla.com",
				withBorder: false,
				withBackground: false,
				stretched: true
			}
		}	
	],
};
