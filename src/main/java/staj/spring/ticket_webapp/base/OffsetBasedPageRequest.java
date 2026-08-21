package staj.spring.ticket_webapp.base;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public class OffsetBasedPageRequest {

    public static Pageable createPageable(int start, int end) {
        if (end <= start) {
            throw new IllegalArgumentException("End value must be greater than start value");
        }

        int pageSize = end - start;
        int pageNumber = start / pageSize;

        return PageRequest.of(pageNumber, pageSize).withSort(Sort.by("id").descending());
    }
}
