function (newDoc, savedDoc, userCtx) {
    if (!(userCtx.name == "admin")) {
        const userprefix = "~vodle.user.", pollprefix = "~vodle.poll.";
        let _id = newDoc._id;
        if (_id.startsWith(userprefix)) {
            // let only the owner create, update, or delete it:
            if (!_id.startsWith("~" + userCtx.name +":")) {
                throw ({forbidden: 'Only the owner of a user document _id may update it.'});
            }
        } else if (_id.startsWith(pollprefix)) {
            if (_id.includes('.voter.')) {
                // it's a voter doc.
                // let only the owner create, update, or delete it:
                if (!_id.startsWith("~" + userCtx.name +":")) {
                    throw ({forbidden: 'Only the owner of a voter document _id may update it.'});
                }
                // check whether doc contains a due date:
                if (newDoc.due) {
                    // reject if past due:
                    if (new Date() > new Date(newDoc.due)) {
                        throw ({forbidden: 'Attempt to change voting data after due date.'})
                    }
                }
            } else {
                // it's a poll doc.
                // is it the combi doc due+state?
                if (_id.endsWith("due_and_state")) {
                    // yes, so make sure due is not changed and state is changed in accordance to due:
                    if (savedDoc && (newDoc.due != savedDoc.due)) {
                        throw ({forbidden: 'Noone may update or delete due dates.'})
                    } else if ((newDoc.due||'') != '') {
                        let now = new Date();
                        let due = new Date(newDoc.due);
                        if (newDoc.state != 'closed' && now > due) {
                            throw ({forbidden: 'Attempt to set state to not closed after due date.'})
                        } else if (newDoc.state == 'closed' && now < due) {
                            throw ({forbidden: 'Attempt to set state to closed before due date.'})
                        }
                    }
                } else {
                    // if it already exists, let noone update or delete it:
                    if (savedDoc) {
                        throw ({forbidden: 'Noone may update or delete existing poll documents.'})
                    }
                    // let only the voters create it:
                    let doc_pid = _id.substring(pollprefix.length, _id.indexOf(':')); 
                    if (!userCtx.name.startsWith("vodle.poll." + doc_pid +".voter.")) {
                        throw ({forbidden: 'Only voters in a poll may create poll documents.'});
                    }
                    // check whether doc contains a due date:
                    if (newDoc.due) {
                        // reject if past due:
                        if (new Date() > new Date(newDoc.due)) {
                            throw ({forbidden: 'Attempt to change voting data after due date.'})
                        }
                    }
                }
            }
        }
    }
}