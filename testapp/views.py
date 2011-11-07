from django.http import HttpResponse
from django.contrib.auth.models import User
from django.template import Context,loader,RequestContext
from django.template.loader import get_template
STATIC_URL = '/static/'


def home_page(request):
    template = get_template('home_page.html')
    c = RequestContext(request, {
        #can add variables
        })
    output = template.render(c)
        
    return HttpResponse(output)
