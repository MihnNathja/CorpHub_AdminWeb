export const buildCommentTree = (comments) => {
    const map = {};
    const roots = [];

    comments.forEach((c) => {
        map[c.id] = { ...c, children: [] };
    });

    comments.forEach((c) => {
        if (c.parentId) {
            map[c.parentId]?.children.push(map[c.id]);
        } else {
            roots.push(map[c.id]);
        }
    });

    return roots;
};
