exports.events = {
    "COMMIT": 1
}

exports.labels = {
    1: "COMMIT"
}

var model = exports.model = {};

model.author = function(
    name,
    email,
    alias
    ) {
    this.name = name;
    this.email = email;
    this.alias = alias;
}

model.commitEvent = function(
    commit, author, repository, meta
    ) {
    this.commit = commit;
    this.author = author;
    this.repository = repository;
    this.meta = meta;
}

model.repository = function(
    name,
    url,
    master_branch,
    description
    ) {
    this.name = name;
    this.url = url;
    this.master_branch = master_branch;
    this.description = description;
}

model.commit = function(
    id,
    message,
    timestamp
    ) {
    this.id = id;
    this.message = message;
    this.timestamp = timestamp;
}