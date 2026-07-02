export interface CreateNoteDTO {
	title: string;
	content?: string;
	tag_ids?: number[];
	folder_id?: string;
}

export interface UpdateNoteDTO {
	title?: string;
	content?: string;
	is_pinned?: boolean;
	is_archived?: boolean;
	is_favorite?: boolean;
	tag_ids?: number[];
	folder_id?: string | null;
}

export interface CreateFolderDTO {
	name: string;
}

export interface UpdateFolderDTO {
	name: string;
}

export interface RegisterDTO {
	email: string;
	password: string;
}

export interface LoginDTO {
	email: string;
	password: string;
}
