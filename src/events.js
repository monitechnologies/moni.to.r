exports.events = {
    "COMMIT": 1,
    "PULL_REQUEST": 2,
    "BUILD_STARTED": 3,
    "BUILD_FINISHED": 4
}

exports.labels = {
    1: "COMMIT",
    2: "PULL_REQUEST",
    3: "BUILD_STARTED",
    4: "BUILD_FINISHED"
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

model.buildEvent = function(
    status, commit, repository, meta
    ) {
    this.status = status;
    this.commit = commit;
    this.repository = repository;
    this.meta = meta
}

model.prEvent = function(
    baseCommit, headCommit, repository, meta
    ) {
    this.baseCommit = baseCommit;
    this.headCommit = headCommit;
    this.repository = repository;
    this.meta = meta;
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