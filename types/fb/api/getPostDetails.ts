import { FacebookImageDetails } from '../imageDetails';
import { FacebookPostType } from '../postType';

export interface FacebookAPIGetPostDetails {
	attachments: {
		data: [
			{
				media: {
					image: FacebookImageDetails;
				},
				subattachments?: {
					data: [
						{
							media: {
								image: FacebookImageDetails;
							},
							type: FacebookPostType;
						},
					]
				},
				description?:string;
				title?: string;
				type: FacebookPostType;
				url: string;
			},
		]
	}
}
